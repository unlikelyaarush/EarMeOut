const { randomUUID } = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
    console.error('Missing GEMINI_API_KEY. Please add it to your .env file before starting the server.');
    process.exit(1);
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Supabase client only if credentials are provided
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
        supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        console.log('Supabase connected successfully');
    } catch (error) {
        console.warn('Supabase initialization failed:', error.message);
        console.warn('Continuing without Supabase - conversations will be stored in memory only');
    }
} else {
    console.warn('Supabase credentials not found. Conversations will be stored in memory only.');
    console.warn('To enable database storage, add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env file');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_ID = process.env.GEMINI_MODEL_ID || 'gemini-2.0-flash';

const MAX_CONTEXT_MESSAGES = 12;

// Middleware to verify JWT token (only if Supabase is available)
const verifyToken = async (req, res, next) => {
    if (!supabase) {
        // If Supabase is not configured, skip auth
        req.user = { id: 'anonymous' };
        return next();
    }
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token verification failed' });
    }
};

// Fallback to in-memory storage if Supabase is not available
const conversations = new Map();

// Get or create conversation
const getOrCreateConversation = async (userId, conversationId) => {
    if (!supabase) {
        // Fallback to in-memory storage
        if (conversationId && conversations.has(conversationId)) {
            return { conversationId, history: conversations.get(conversationId) };
        }
        const newConversationId = randomUUID();
        conversations.set(newConversationId, []);
        return { conversationId: newConversationId, history: [] };
    }
    
    if (conversationId) {
        const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('id', conversationId)
            .eq('user_id', userId)
            .single();
        
        if (data && !error) {
            return { conversationId: data.id, history: data.history || [] };
        }
    }
    
    // Create new conversation
    const newConversationId = randomUUID();
    const { error } = await supabase
        .from('conversations')
        .insert({
            id: newConversationId,
            user_id: userId,
            history: []
        });
    
    if (error) {
        console.error('Error creating conversation:', error);
    }
    
    return { conversationId: newConversationId, history: [] };
};

// Save conversation history
const saveConversation = async (conversationId, history) => {
    if (!supabase) {
        // Fallback to in-memory storage
        conversations.set(conversationId, history);
        return;
    }
    
    const { error } = await supabase
        .from('conversations')
        .update({ 
            history: history,
            updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
    
    if (error) {
        console.error('Error saving conversation:', error);
    }
};

app.post("/message", verifyToken, async (req, res) => {
    const { message: userMessage, conversationId: incomingConversationId } = req.body ?? {};
    const userId = req.user.id;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Get or create conversation
        const { conversationId, history } = await getOrCreateConversation(userId, incomingConversationId);
        
        // Add user message to history
        const nextHistory = [...history, { role: 'user', content: userMessage }].slice(-MAX_CONTEXT_MESSAGES);

        const contents = nextHistory.map((entry) => ({
            role: entry.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: entry.content }],
        }));

        const result = await genAI
            .getGenerativeModel({ model: MODEL_ID })
            .generateContent({ contents });
        
        const assistantText = result.response.text() || '(No response)';

        // Update history with assistant response
        const updatedHistory = [...nextHistory, { role: 'assistant', content: assistantText }].slice(-MAX_CONTEXT_MESSAGES);
        
        // Save to database
        await saveConversation(conversationId, updatedHistory);

        res.json({ message: assistantText, conversationId });
    } catch (err) {
        console.error('Error: ', err);
        res
            .status(500)
            .json({ error: err.message || 'An error occurred while processing your message' });
    }
});

// Get user's conversations
app.get("/conversations", verifyToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('conversations')
            .select('id, created_at, updated_at, history')
            .eq('user_id', req.user.id)
            .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        res.json({ conversations: data || [] });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend API server running on port ${PORT}`);
});


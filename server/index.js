const { randomUUID } = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

// Load system prompt for Gemini
let SYSTEM_PROMPT = '';
try {
    const promptPath = path.join(__dirname, '..', 'prompts', 'prompt.gemini.txt');
    SYSTEM_PROMPT = fs.readFileSync(promptPath, 'utf8').trim();
    console.log('System prompt loaded successfully');
} catch (error) {
    console.warn('Could not load system prompt file:', error.message);
    console.warn('Using default system prompt');
    SYSTEM_PROMPT = 'You are Echo, a compassionate and empathetic AI mental health companion. Provide a safe, non-judgmental space for users to express themselves.';
}

// Initialize OpenAI client for Hack Club AI
// Hack Club AI uses OpenAI-compatible API and can proxy to Gemini
const openai = new OpenAI({
  apiKey: process.env.HACK_CLUB_AI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.HACK_CLUB_AI_BASE_URL,
});

if (!process.env.HACK_CLUB_AI_API_KEY && !process.env.OPENAI_API_KEY) {
    console.error('Missing HACK_CLUB_AI_API_KEY or OPENAI_API_KEY. Please add it to your .env file before starting the server.');
    process.exit(1);
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Supabase clients
// We need both: anon key for token verification, service role for database operations
let supabase = null;
let supabaseAdmin = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
        // Admin client for database operations (bypasses RLS)
        supabaseAdmin = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        
        // Anon client for token verification (respects RLS)
        // Use anon key from env
        const anonKey = process.env.SUPABASE_ANON_KEY;
        if (!anonKey) {
            console.warn('SUPABASE_ANON_KEY not found. Token verification may fail.');
        }
        supabase = createClient(
            process.env.SUPABASE_URL,
            anonKey || process.env.SUPABASE_SERVICE_ROLE_KEY // Fallback to service role if anon key not available
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

// AI Model configuration
const MODEL_ID = process.env.AI_MODEL || 'google/gemini-3-pro-preview';

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
        // Use the anon client to verify the user token
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error) {
            console.error('Token verification error:', error.message);
            return res.status(401).json({ error: 'Invalid token: ' + error.message });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification exception:', error);
        res.status(401).json({ error: 'Token verification failed: ' + error.message });
    }
};

// Fallback to in-memory storage if Supabase is not available
const conversations = new Map();

// Get or create conversation
const getOrCreateConversation = async (userId, conversationId) => {
    if (!supabaseAdmin) {
        // Fallback to in-memory storage
        if (conversationId && conversations.has(conversationId)) {
            return { conversationId, history: conversations.get(conversationId) };
        }
        const newConversationId = randomUUID();
        conversations.set(newConversationId, []);
        return { conversationId: newConversationId, history: [] };
    }
    
    if (conversationId) {
        const { data, error } = await supabaseAdmin
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
    const { error } = await supabaseAdmin
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
    if (!supabaseAdmin) {
        // Fallback to in-memory storage
        conversations.set(conversationId, history);
        return;
    }
    
    const { error } = await supabaseAdmin
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

        // Convert history to OpenAI format and add system prompt
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...nextHistory.map((entry) => ({
                role: entry.role === 'assistant' ? 'assistant' : 'user',
                content: entry.content,
            }))
        ];

        // Call OpenAI API through Hack Club AI (which proxies to Gemini)
        let assistantText = '(No response)';
        try {
            const completion = await openai.chat.completions.create({
                model: MODEL_ID,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
            });
            
            assistantText = completion.choices[0]?.message?.content || '(No response)';
        } catch (apiError) {
            console.error('OpenAI API Error:', apiError);
            // Provide a helpful error message
            if (apiError.message?.includes('model')) {
                assistantText = 'Sorry, there was an issue with the AI model. Please try again.';
            } else if (apiError.message?.includes('rate limit')) {
                assistantText = 'The AI service is currently busy. Please try again in a moment.';
            } else {
                assistantText = 'Sorry, I encountered an error. Please try again.';
            }
            // Don't throw - return the error message to user instead
        }

        // Update history with assistant response
        const updatedHistory = [...nextHistory, { role: 'assistant', content: assistantText }].slice(-MAX_CONTEXT_MESSAGES);
        
        // Save to database
        await saveConversation(conversationId, updatedHistory);

        res.json({ message: assistantText, conversationId });
    } catch (err) {
        console.error('Error processing message:', {
            message: err.message,
            name: err.name,
            code: err.code,
            stack: err.stack
        });
        
        const errorMessage = err.message || 'An error occurred while processing your message';
        res.status(500).json({ error: errorMessage });
    }
});

// Get user's conversations
app.get("/conversations", verifyToken, async (req, res) => {
    if (!supabaseAdmin) {
        return res.status(503).json({ error: 'Supabase not configured' });
    }
    
    try {
        const { data, error } = await supabaseAdmin
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend API server running on port ${PORT}`);
});


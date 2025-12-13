const path = require('path');
const { randomUUID } = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
    console.error('Missing GEMINI_API_KEY. Please add it to your environment before starting the server.');
    process.exit(1);
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_ID = process.env.GEMINI_MODEL_ID || 'gemini-2.0-flash';

const MAX_CONTEXT_MESSAGES = 12;
const conversations = new Map();

app.post("/message", (req, res) => {
    const { message: userMessage, conversationId: incomingConversationId } = req.body ?? {};

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const conversationId = incomingConversationId || randomUUID();
    const history = conversations.get(conversationId) ?? [];
    const nextHistory = [...history, { role: 'user', content: userMessage }].slice(-MAX_CONTEXT_MESSAGES);

    const contents = nextHistory.map((entry) => ({
        role: entry.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: entry.content }],
    }));

    genAI
    .getGenerativeModel({ model: MODEL_ID })
    .generateContent({ contents })
    .then((result) => {
        const assistantText = result.response.text() || '(No response)';

        const updatedHistory = [...nextHistory, { role: 'assistant', content: assistantText }].slice(-MAX_CONTEXT_MESSAGES);
        conversations.set(conversationId, updatedHistory);

        res.json({ message: assistantText, conversationId });
    })
    .catch((err) => {
        console.error('Error: ', err);
        res
            .status(500)
            .json({ error: err.message || 'An error occurred while processing your message' });
    });
});

app.listen(3000, () => {
    console.log("Running on port 3000")
});
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

let SYSTEM_PROMPT = '';
try {
    const promptPath = path.join(process.cwd(), 'prompts', 'prompt.gemini.txt');
    SYSTEM_PROMPT = fs.readFileSync(promptPath, 'utf8').trim();
} catch (error) {
    SYSTEM_PROMPT = 'You are Echo, a compassionate and empathetic AI mental health companion. Provide a safe, non-judgmental space for users to express themselves.';
}

const openai = new OpenAI({
    apiKey: process.env.HACK_CLUB_AI_API_KEY || process.env.OPENAI_API_KEY,
    baseURL: process.env.HACK_CLUB_AI_BASE_URL,
});

let supabase = null;
let supabaseAdmin = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
        supabaseAdmin = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const anonKey = process.env.SUPABASE_ANON_KEY;
        supabase = createClient(
            process.env.SUPABASE_URL,
            anonKey || process.env.SUPABASE_SERVICE_ROLE_KEY
        );
    } catch (_) {
        // Continue without Supabase
    }
}

const MODEL_ID = process.env.AI_MODEL || 'google/gemini-3-pro-preview';
const MAX_CONTEXT_MESSAGES = 12;

async function verifyToken(req) {
    if (!supabase) {
        return { user: { id: 'anonymous' } };
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return { error: 'No token provided', status: 401 };
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) return { error: 'Invalid token: ' + error.message, status: 401 };
        if (!user) return { error: 'User not found', status: 401 };
        return { user };
    } catch (error) {
        return { error: 'Token verification failed: ' + error.message, status: 401 };
    }
}

module.exports = {
    SYSTEM_PROMPT,
    openai,
    supabase,
    supabaseAdmin,
    MODEL_ID,
    MAX_CONTEXT_MESSAGES,
    verifyToken,
};

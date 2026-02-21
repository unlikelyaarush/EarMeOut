const { randomUUID } = require('crypto');
const {
    SYSTEM_PROMPT,
    openai,
    supabaseAdmin,
    MODEL_ID,
    MAX_CONTEXT_MESSAGES,
    verifyToken,
} = require('./_lib/shared');

async function getOrCreateConversation(userId, conversationId) {
    if (!supabaseAdmin) {
        return { conversationId: randomUUID(), history: [] };
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

    const newId = randomUUID();
    const { error } = await supabaseAdmin
        .from('conversations')
        .insert({ id: newId, user_id: userId, history: [] });

    if (error) {
        console.error('Error creating conversation:', error);
    }

    return { conversationId: newId, history: [] };
}

async function saveConversation(conversationId, history) {
    if (!supabaseAdmin) return;

    const { error } = await supabaseAdmin
        .from('conversations')
        .update({ history, updated_at: new Date().toISOString() })
        .eq('id', conversationId);

    if (error) {
        console.error('Error saving conversation:', error);
    }
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const auth = await verifyToken(req);
    if (auth.error) return res.status(auth.status).json({ error: auth.error });

    const { message: userMessage, conversationId: incomingConversationId } = req.body ?? {};
    const userId = auth.user.id;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const { conversationId, history } = await getOrCreateConversation(userId, incomingConversationId);

        const nextHistory = [...history, { role: 'user', content: userMessage }].slice(-MAX_CONTEXT_MESSAGES);

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...nextHistory.map((entry) => ({
                role: entry.role === 'assistant' ? 'assistant' : 'user',
                content: entry.content,
            }))
        ];

        let assistantText = '(No response)';
        try {
            const completion = await openai.chat.completions.create({
                model: MODEL_ID,
                messages,
                temperature: 0.7,
                max_tokens: 1000,
            });
            assistantText = completion.choices[0]?.message?.content || '(No response)';
        } catch (apiError) {
            if (apiError.message?.includes('model')) {
                assistantText = 'Sorry, there was an issue with the AI model. Please try again.';
            } else if (apiError.message?.includes('rate limit')) {
                assistantText = 'The AI service is currently busy. Please try again in a moment.';
            } else {
                assistantText = 'Sorry, I encountered an error. Please try again.';
            }
        }

        const updatedHistory = [...nextHistory, { role: 'assistant', content: assistantText }].slice(-MAX_CONTEXT_MESSAGES);
        await saveConversation(conversationId, updatedHistory);

        res.json({ message: assistantText, conversationId });
    } catch (err) {
        console.error('Error processing message:', err.message);
        res.status(500).json({ error: err.message || 'An error occurred while processing your message' });
    }
};

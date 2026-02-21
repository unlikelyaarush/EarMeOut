const { supabaseAdmin, verifyToken } = require('../_lib/shared');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const auth = await verifyToken(req);
    if (auth.error) return res.status(auth.status).json({ error: auth.error });

    if (!supabaseAdmin) {
        return res.status(503).json({ error: 'Supabase not configured' });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('conversations')
            .select('id, created_at, updated_at, history')
            .eq('user_id', auth.user.id)
            .order('updated_at', { ascending: false });

        if (error) throw error;

        res.json({ conversations: data || [] });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};

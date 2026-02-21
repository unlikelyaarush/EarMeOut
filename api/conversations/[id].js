const { supabaseAdmin, verifyToken } = require('../_lib/shared');

module.exports = async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const auth = await verifyToken(req);
    if (auth.error) return res.status(auth.status).json({ error: auth.error });

    if (!supabaseAdmin) {
        return res.status(503).json({ error: 'Supabase not configured' });
    }

    const { id } = req.query;

    try {
        const { error } = await supabaseAdmin
            .from('conversations')
            .delete()
            .eq('id', id)
            .eq('user_id', auth.user.id);

        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
};

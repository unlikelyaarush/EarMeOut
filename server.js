const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint placeholder for future chatbot integration
app.post('/api/chat', (req, res) => {
    // This will be implemented later with chatbot API
    res.json({ 
        message: 'Chatbot API endpoint - to be implemented',
        timestamp: new Date().toISOString()
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Network access: http://0.0.0.0:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});

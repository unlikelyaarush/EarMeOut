# EarMeOut - A Safe Space to Talk

A clean, mobile-friendly website structure for a mental health chatbot application.

## Features

- 🎨 Clean, minimal design with soft colors and rounded corners
- 📱 Mobile-responsive layout
- 💬 Chat interface with message history
- 🚀 Express.js backend ready for chatbot integration
- ✨ Smooth animations and modern UI elements

## Project Structure

```
earmeout-chatbot/
├── server.js          # Express backend server
├── package.json       # Dependencies and scripts
├── public/
│   ├── index.html     # Main HTML page
│   └── style.css      # Styling and responsive design
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
   ```bash
   cd earmeout-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and go to:
   ```
   http://localhost:3000
   ```

### Development

For development with auto-reload:
```bash
npm run dev
```

## Current Status

- ✅ Basic website structure
- ✅ Responsive design
- ✅ Chat interface layout
- ✅ Express backend setup
- 🔄 Chatbot API integration (placeholder ready)
- 🔄 Message persistence (to be implemented)

## Next Steps

To connect your chatbot:

1. **API Integration**: Modify the `/api/chat` endpoint in `server.js`
2. **Message Handling**: Update the frontend JavaScript to call your chatbot API
3. **Data Storage**: Add database integration for chat history
4. **Authentication**: Implement user management if needed

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with gradients and animations
- **Responsiveness**: Mobile-first CSS approach

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to modify and use as needed.

---

**Note**: This is a frontend structure. The chatbot functionality is currently placeholder and will need to be implemented based on your specific chatbot API or service.

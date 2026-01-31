# EarMeOut - A Safe Space to Talk

A mental health chatbot application providing a safe, judgment-free space for users to express themselves.

## Features

- 🎨 Clean, minimal design with smooth animations
- 📱 Mobile-responsive layout
- 💬 AI-powered chat interface with conversation history
- 🔐 User authentication and profiles
- 🚀 Express.js backend with Supabase integration
- ✨ Modern React frontend with GSAP animations

## Project Structure

```
EarMeOut/
├── server/
│   └── index.js       # Express backend server
├── src/
│   ├── components/    # React components
│   ├── contexts/      # React contexts (Auth)
│   ├── lib/          # Utilities and services
│   └── App.js        # Main app component
├── public/            # Static assets
├── prompts/          # AI system prompts
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/unlikelyaarush/EarMeOut.git
   cd EarMeOut
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and fill in your API keys and Supabase credentials.

4. Start the development server:
   ```bash
   npm start
   ```
   This will start both the React frontend (port 3000) and Express backend (port 3001).

5. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## Environment Variables

See `.env.example` for all required environment variables. At minimum, you need:
- `HACK_CLUB_AI_API_KEY` or `OPENAI_API_KEY` (required)
- `REACT_APP_SUPABASE_URL` (required)
- `REACT_APP_SUPABASE_ANON_KEY` (required)
- `SUPABASE_URL` (optional, for backend)
- `SUPABASE_SERVICE_ROLE_KEY` (optional, for backend)

## Technologies Used

- **Frontend**: React, React Router, GSAP, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **AI**: Hack Club AI / OpenAI API (proxying to Gemini)
- **Styling**: CSS3, Tailwind CSS utilities

## License

MIT License - see LICENSE.txt for details.

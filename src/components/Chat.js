import React from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from './Chatbot';
import { ArrowLeft } from 'lucide-react';
import './Page.css';

const Chat = () => {
  const navigate = useNavigate();

  return (
    <div className="chat-page-full chat-page-full--solid">
      <button
        className="chat-back-button"
        onClick={() => navigate('/')}
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>
      <Chatbot />
    </div>
  );
};

export default Chat;

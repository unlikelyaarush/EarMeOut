import React from 'react';
import Navigation from './Navigation';
import Chatbot from './Chatbot';
import MorningTide from './MorningTide';
import Footer from './Footer';
import './Page.css';

const Chat = () => {
  return (
    <div className="page">
      <MorningTide />
      <Navigation />
      <div className="page-content">
        <h1 className="page-title">Chat</h1>
        <div className="page-body chat-page-body">
          <Chatbot />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;

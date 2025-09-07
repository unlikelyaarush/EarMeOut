import React from 'react';
import Navigation from './Navigation';
import './Page.css';

const Chat = () => {
  return (
    <div className="page">
      <Navigation />
      <div className="page-content">
        <h1 className="page-title">Chat</h1>
        <div className="page-body">
          <p>This is the Chat page. Content will be added here soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;

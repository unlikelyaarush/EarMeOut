import React from 'react';
import Navigation from './Navigation';
import Chatbot from './Chatbot';
import Iridescence from './Iridescence';
import Footer from './Footer';
import './Page.css';

const Chat = () => {
  return (
    <div className="page">
      <Iridescence
        color={[0, .3, .5]}
        mouseReact={false}
        amplitude={0.1}
        speed={.4}
      />
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

import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { useAuth } from '../contexts/AuthContext';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(() => {
    return sessionStorage.getItem('conversationId') || null;
  });
  const chatLogRef = useRef(null);
  const { session } = useAuth();

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTo({
        top: chatLogRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const appendMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = inputValue.trim();

    if (!message || isLoading) return;

    appendMessage('you', message);
    setInputValue('');
    setIsLoading(true);

    try {
      const payload = conversationId
        ? { message, conversationId }
        : { message };

      // Debug: Check if session and token exist
      if (!session) {
        appendMessage('assistant', 'You are not logged in. Please log in to continue.');
        setIsLoading(false);
        return;
      }

      if (!session.access_token) {
        console.error('No access token in session:', session);
        appendMessage('assistant', 'Session error. Please log out and log back in.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          appendMessage('assistant', 'Your session has expired. Please log in again.');
          setIsLoading(false);
          return;
        }
        // Show the actual error message from the server
        const errorMsg = errorData.error || `Request failed with status ${response.status}`;
        console.error('Server error:', errorMsg);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      if (data.conversationId) {
        setConversationId(data.conversationId);
        sessionStorage.setItem('conversationId', data.conversationId);
      }
      appendMessage('assistant', data.message ?? '(No response)');
    } catch (error) {
      console.error('Chatbot error:', error);
      // Show more specific error message
      const errorMessage = error.message || 'Sorry, something went wrong. Please try again.';
      appendMessage('assistant', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <header className="chatbot__header">
        <h1>EarMeOut</h1>
        <p>Ask anything and the assistant will respond.</p>
      </header>
      <section 
        ref={chatLogRef}
        className="chatbot__log" 
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="chatbot__welcome">
            <p>Start a conversation by typing a message below.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatbot__message ${
              msg.role === 'assistant' ? 'chatbot__message--assistant' : 'chatbot__message--user'
            }`}
          >
            <p className="chatbot__text">{msg.text}</p>
          </div>
        ))}
        {isLoading && (
          <div className="chatbot__message chatbot__message--assistant chatbot__message--loading">
            <p className="chatbot__text">Thinking...</p>
          </div>
        )}
      </section>
      <form className="chatbot__form" onSubmit={handleSubmit} autoComplete="off">
        <label className="sr-only" htmlFor="user-input">Message</label>
        <input
          id="user-input"
          name="message"
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          required
        />
        <button type="submit" disabled={isLoading} aria-label="Send message">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;


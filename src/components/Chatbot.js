import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Chatbot.css';
import { useAuth } from '../contexts/AuthContext';
import { ArrowUp, Paperclip } from 'lucide-react';
import { cn } from '../lib/utils';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(() => {
    return sessionStorage.getItem('conversationId') || null;
  });
  const chatLogRef = useRef(null);
  const textareaRef = useRef(null);
  const { session } = useAuth();

  // Auto-resize textarea
  const adjustHeight = useCallback((reset) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (reset) {
      textarea.style.height = '60px';
      return;
    }

    textarea.style.height = '60px';
    const newHeight = Math.max(60, Math.min(textarea.scrollHeight, 200));
    textarea.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '60px';
    }
  }, []);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adjustHeight]);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTo({
        top: chatLogRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Split long messages into chunks for texting-like experience
  const splitMessageIntoChunks = (text, maxChunkLength = 200) => {
    if (text.length <= maxChunkLength) {
      return [text];
    }

    // Try to split by sentences first
    const sentences = text.match(/[^.!?]+[.!?]+[\])'"`'']*|.+/g) || [text];
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      // If adding this sentence would exceed the limit, save current chunk and start new one
      if (currentChunk && (currentChunk.length + trimmedSentence.length + 1) > maxChunkLength) {
        chunks.push(currentChunk.trim());
        currentChunk = trimmedSentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
      }

      // If a single sentence is too long, split it by character limit
      if (currentChunk.length > maxChunkLength) {
        while (currentChunk.length > maxChunkLength) {
          chunks.push(currentChunk.substring(0, maxChunkLength).trim());
          currentChunk = currentChunk.substring(maxChunkLength).trim();
        }
      }
    }

    // Add remaining chunk
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  };

  const appendMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  const appendMessageChunked = async (role, text) => {
    // Only chunk assistant messages that are long enough
    if (role === 'assistant' && text.length > 150) {
      const chunks = splitMessageIntoChunks(text);
      
      // Add first chunk immediately
      appendMessage(role, chunks[0]);
      
      // Add remaining chunks with a delay to simulate texting
      for (let i = 1; i < chunks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400)); // 800-1200ms delay
        appendMessage(role, chunks[i]);
      }
    } else {
      // For short messages or user messages, add immediately
      appendMessage(role, text);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = inputValue.trim();

    if (!message || isLoading) return;

    appendMessage('you', message);
    setInputValue('');
    adjustHeight(true);
    setIsLoading(true);

    try {
      const payload = conversationId
        ? { message, conversationId }
        : { message };

      if (!session) {
        await appendMessageChunked('assistant', 'You are not logged in. Please log in to continue.');
        setIsLoading(false);
        return;
      }

      if (!session.access_token) {
        console.error('No access token in session:', session);
        await appendMessageChunked('assistant', 'Session error. Please log out and log back in.');
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
          await appendMessageChunked('assistant', 'Your session has expired. Please log in again.');
          setIsLoading(false);
          return;
        }
        const errorMsg = errorData.error || `Request failed with status ${response.status}`;
        console.error('Server error:', errorMsg);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      if (data.conversationId) {
        setConversationId(data.conversationId);
        sessionStorage.setItem('conversationId', data.conversationId);
      }
      await appendMessageChunked('assistant', data.message ?? '(No response)');
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = error.message || 'Sorry, something went wrong. Please try again.';
      await appendMessageChunked('assistant', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="chatbot-modern">
      <div className="chatbot-modern__container">
        <header className="chatbot-modern__header">
          <div className="chatbot-modern__header-content">
            <div className="chatbot-modern__header-avatar">
              <img 
                src="/earmeout-bot.png" 
                alt="Echo" 
                className="chatbot-modern__avatar-image"
              />
            </div>
            <div className="chatbot-modern__header-text">
              <h1 className="chatbot-modern__title">Echo</h1>
              <p className="chatbot-modern__subtitle">Your supportive listener - here to help</p>
            </div>
          </div>
        </header>

        <section 
          ref={chatLogRef}
          className="chatbot-modern__messages" 
          aria-live="polite"
        >
          {messages.length === 0 && (
            <div className="chatbot-modern__welcome">
              <div className="chatbot-modern__welcome-content">
                <div className="chatbot-modern__welcome-avatar">
                  <img 
                    src="/earmeout-bot.png" 
                    alt="Echo" 
                    className="chatbot-modern__avatar-image chatbot-modern__avatar-image--large"
                  />
                </div>
                <h2>Hi there! I'm Echo 👋</h2>
                <p>I'm here to listen and support you. Think of me as a caring friend who's always available when you need to talk. Share whatever's on your mind - there's no judgment here, just understanding.</p>
                <div className="chatbot-modern__suggestions">
                  <p className="chatbot-modern__suggestions-title">We can talk about:</p>
                  <ul>
                    <li>How you're feeling today</li>
                    <li>Things that are worrying you</li>
                    <li>Stress management techniques</li>
                    <li>Building healthy coping strategies</li>
                    <li>Any thoughts or emotions you'd like to explore</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'chatbot-modern__message',
                msg.role === 'assistant' 
                  ? 'chatbot-modern__message--assistant' 
                  : 'chatbot-modern__message--user'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="chatbot-modern__message-avatar">
                  <img 
                    src="/earmeout-bot.png" 
                    alt="Echo" 
                    className="chatbot-modern__avatar-image chatbot-modern__avatar-image--small"
                  />
                </div>
              )}
              <div className="chatbot-modern__message-content">
                <p className="chatbot-modern__message-text">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chatbot-modern__message chatbot-modern__message--assistant chatbot-modern__message--loading">
              <div className="chatbot-modern__message-avatar">
                <img 
                  src="/earmeout-bot.png" 
                  alt="Echo" 
                  className="chatbot-modern__avatar-image chatbot-modern__avatar-image--small"
                />
              </div>
              <div className="chatbot-modern__message-content">
                <div className="chatbot-modern__typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </section>

        <form className="chatbot-modern__form" onSubmit={handleSubmit} autoComplete="off">
          <div className="chatbot-modern__input-wrapper">
            <textarea
              ref={textareaRef}
              id="user-input"
              name="message"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              required
              rows={1}
              className="chatbot-modern__textarea"
              style={{ overflow: 'hidden' }}
            />
            
            <div className="chatbot-modern__form-actions">
              <button
                type="button"
                className="chatbot-modern__attach-btn"
                aria-label="Attach file"
                title="Attach file"
              >
                <Paperclip size={18} />
              </button>
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className={cn(
                  'chatbot-modern__send-btn',
                  inputValue.trim() && 'chatbot-modern__send-btn--active'
                )}
                aria-label="Send message"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;

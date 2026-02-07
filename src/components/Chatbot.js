import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Chatbot.css';
import { useAuth } from '../contexts/AuthContext';
import { ArrowUp, Paperclip, Menu, Plus, Trash2, X } from 'lucide-react';
import { cn } from '../lib/utils';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(() => {
    return sessionStorage.getItem('conversationId') || null;
  });
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    return !sessionStorage.getItem('disclaimerDismissed');
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
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

  const appendMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  // Parse AI response for [CRISIS] and [SPLIT] markers
  const appendAssistantMessage = async (text) => {
    let cleaned = text;

    // Check for crisis flag
    if (cleaned.startsWith('[CRISIS]')) {
      setShowCrisisBanner(true);
      cleaned = cleaned.replace('[CRISIS]', '').trim();
    }

    const parts = cleaned.split('[SPLIT]').map(p => p.trim()).filter(Boolean);

    // Add first message immediately
    appendMessage('assistant', parts[0]);

    // Add any follow-up messages with natural delays
    for (let i = 1; i < parts.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
      appendMessage('assistant', parts[i]);
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
        await appendAssistantMessage('You are not logged in. Please log in to continue.');
        setIsLoading(false);
        return;
      }

      if (!session.access_token) {
        console.error('No access token in session:', session);
        await appendAssistantMessage('Session error. Please log out and log back in.');
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
          await appendAssistantMessage('Your session has expired. Please log in again.');
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
      await appendAssistantMessage(data.message ?? '(No response)');
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = error.message || 'Sorry, something went wrong. Please try again.';
      await appendAssistantMessage(errorMessage);
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

  // Fetch conversation list for sidebar
  const fetchConversations = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch('/conversations', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (_) {}
  }, [session]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load a past conversation
  const loadConversation = (convo) => {
    const history = (convo.history || []).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'you',
      text: m.content,
    }));
    setMessages(history);
    setConversationId(convo.id);
    sessionStorage.setItem('conversationId', convo.id);
    setSidebarOpen(false);
    setShowCrisisBanner(false);
  };

  // Start new chat
  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    sessionStorage.removeItem('conversationId');
    setSidebarOpen(false);
    setShowCrisisBanner(false);
  };

  // Delete a conversation
  const deleteConversation = async (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!session?.access_token) return;
    try {
      const res = await fetch(`/conversations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (conversationId === id) {
          setMessages([]);
          setConversationId(null);
          sessionStorage.removeItem('conversationId');
          setShowCrisisBanner(false);
        }
      } else {
        console.error('Delete failed:', res.status, await res.text());
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const dismissDisclaimer = () => {
    setShowDisclaimer(false);
    sessionStorage.setItem('disclaimerDismissed', 'true');
  };

  // Get a preview of a conversation
  const getConvoPreview = (convo) => {
    const firstUserMsg = (convo.history || []).find(m => m.role === 'user');
    if (firstUserMsg) {
      const text = firstUserMsg.content;
      return text.length > 40 ? text.substring(0, 40) + '...' : text;
    }
    return 'New conversation';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="chatbot-modern">
      {/* Sidebar overlay */}
      {sidebarOpen && <div className="chatbot-sidebar__overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Conversation Sidebar */}
      <aside className={cn('chatbot-sidebar', sidebarOpen && 'chatbot-sidebar--open')}>
        <div className="chatbot-sidebar__header">
          <h2>Conversations</h2>
          <button className="chatbot-sidebar__close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>
        <button className="chatbot-sidebar__new" onClick={startNewChat}>
          <Plus size={18} />
          New Chat
        </button>
        <div className="chatbot-sidebar__list">
          {conversations.map(convo => (
            <div
              key={convo.id}
              className={cn('chatbot-sidebar__item', conversationId === convo.id && 'chatbot-sidebar__item--active')}
              onClick={() => loadConversation(convo)}
            >
              <div className="chatbot-sidebar__item-text">
                <span className="chatbot-sidebar__item-preview">{getConvoPreview(convo)}</span>
                <span className="chatbot-sidebar__item-date">{formatDate(convo.updated_at || convo.created_at)}</span>
              </div>
              <button
                className="chatbot-sidebar__item-delete"
                onClick={(e) => deleteConversation(convo.id, e)}
                aria-label="Delete conversation"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {conversations.length === 0 && (
            <p className="chatbot-sidebar__empty">No past conversations</p>
          )}
        </div>
      </aside>

      <div className="chatbot-modern__container">
        <header className="chatbot-modern__header">
          <div className="chatbot-modern__header-content">
            <button
              className="chatbot-modern__sidebar-toggle"
              onClick={() => { setSidebarOpen(o => !o); fetchConversations(); }}
              aria-label="Toggle conversation sidebar"
            >
              <Menu size={22} />
            </button>
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

        {/* Crisis Banner */}
        {showCrisisBanner && (
          <div className="chatbot-crisis-banner">
            <p>
              If you're in crisis, please reach out: <strong>call or text 988</strong> | text HOME to <strong>741741</strong> | call <strong>911</strong> for emergencies
            </p>
            <Link to="/crisis" className="chatbot-crisis-banner__link">View all resources</Link>
          </div>
        )}

        {/* Disclaimer */}
        {showDisclaimer && (
          <div className="chatbot-disclaimer">
            <p>Echo is an AI companion, not a licensed therapist. If you need professional help, please reach out to a qualified mental health provider.</p>
            <button className="chatbot-disclaimer__close" onClick={dismissDisclaimer} aria-label="Dismiss"><X size={16} /></button>
          </div>
        )}

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

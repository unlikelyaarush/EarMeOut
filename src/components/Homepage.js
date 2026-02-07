import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import MorningTide from './MorningTide';
import './Homepage.css';

const SUPPORTIVE_MESSAGES = [
  "It's okay to not be okay.",
  "You don't have to carry it all alone.",
  "Your feelings are valid, always.",
  "It takes courage to ask for help.",
  "You matter more than you know.",
  "Healing isn't linear, and that's okay.",
  "Someone out there cares about you.",
  "It's okay to take things one day at a time.",
];

const TypingHero = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [message] = useState(() =>
    SUPPORTIVE_MESSAGES[Math.floor(Math.random() * SUPPORTIVE_MESSAGES.length)]
  );
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const cleanedUp = useRef(false);

  const cleanup = useCallback(() => {
    if (cleanedUp.current) return;
    cleanedUp.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // User clicks → start audio immediately (guaranteed to work), wait 2s, then type
  const handleStart = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);

    // Play audio — this is inside a click handler so browsers allow it
    const audio = new Audio('/typewriter.mp3');
    audio.volume = 0.35;
    audio.loop = true;
    audioRef.current = audio;
    audio.play().catch(() => {});

    // Wait 2 seconds for audio to settle, then start typing
    setTimeout(() => {
      let idx = 0;
      intervalRef.current = setInterval(() => {
        if (idx < message.length) {
          idx += 1;
          setDisplayedText(message.slice(0, idx));
        } else {
          clearInterval(intervalRef.current);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          setTimeout(() => setIsFinished(true), 600);
        }
      }, 130);
    }, 2000);

    return () => cleanup();
  }, [hasStarted, message, cleanup]);

  return (
    <div className="typing-hero" onClick={handleStart}>
      <div className="typing-hero__content">
        {!hasStarted && (
          <p className="typing-hero__tap-hint">click anywhere to begin</p>
        )}
        <p className="typing-hero__text">
          {displayedText}
          {hasStarted && !isFinished && <span className="typing-hero__cursor">|</span>}
        </p>
        <div className={`typing-hero__cta ${isFinished ? 'typing-hero__cta--visible' : ''}`}>
          <button
            className="echo-btn"
            onClick={(e) => { e.stopPropagation(); navigate('/chat'); }}
          >
            <div className="echo-btn__outline"></ div>
            <div className="echo-btn__state echo-btn__state--default">
              <div className="echo-btn__icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20">
                  <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </div>
              <p>
                {'Talk'.split('').map((ch, i) => (
                  <span key={i} style={{ '--i': i }}>{ch}</span>
                ))}
                <span key="space" style={{ '--i': 4 }}>&nbsp;</span>
                {'to'.split('').map((ch, i) => (
                  <span key={`to-${i}`} style={{ '--i': i + 5 }}>{ch}</span>
                ))}
                <span key="space2" style={{ '--i': 7 }}>&nbsp;</span>
                {'Echo'.split('').map((ch, i) => (
                  <span key={`echo-${i}`} style={{ '--i': i + 8 }}>{ch}</span>
                ))}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const Homepage = () => {
  const { user } = useAuth();

  return (
    <div className="homepage">
      <MorningTide speed={1.0} />
      <Navigation />
      {user && <TypingHero />}
    </div>
  );
};

export default Homepage;
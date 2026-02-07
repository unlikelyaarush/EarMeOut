import React from 'react';
import Navigation from './Navigation';
import MorningTide from './MorningTide';
import Footer from './Footer';
import './Page.css';

const CrisisResources = () => {
  return (
    <div className="page">
      <MorningTide />
      <Navigation />
      <div className="page-content">
        <h1 className="page-title">Crisis Resources</h1>
        <div className="page-body privacy-policy-content">

          <div className="privacy-section" style={{ background: 'rgba(255, 85, 85, 0.15)', border: '2px solid rgba(255, 85, 85, 0.4)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
            <h2 className="about-subtitle" style={{ color: '#ff5555' }}>If you are in immediate danger, call 911</h2>
            <p className="about-text">
              If you or someone you know is in immediate physical danger, please call emergency services right away. Your safety comes first.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">988 Suicide & Crisis Lifeline</h2>
            <p className="about-text">
              <strong>Call or text 988</strong> — Available 24/7, free and confidential. The 988 Lifeline provides support for people in suicidal crisis or emotional distress. You can also chat at{' '}
              <a href="https://988lifeline.org/chat" target="_blank" rel="noopener noreferrer" style={{ color: '#4A90E2', textDecoration: 'underline' }}>988lifeline.org/chat</a>.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Crisis Text Line</h2>
            <p className="about-text">
              <strong>Text HOME to 741741</strong> — Free, 24/7 crisis support via text message. Trained crisis counselors are ready to help you through any difficult moment.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">SAMHSA National Helpline</h2>
            <p className="about-text">
              <strong>Call 1-800-662-4357</strong> — Free, confidential, 24/7, 365-day-a-year treatment referral and information service for individuals and families facing mental and/or substance use disorders. Available in English and Spanish.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Trevor Project (LGBTQ+ Youth)</h2>
            <p className="about-text">
              <strong>Call 1-866-488-7386</strong> or <strong>text START to 678-678</strong> — The Trevor Project provides crisis intervention and suicide prevention services to LGBTQ+ young people ages 13-24.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">International Resources</h2>
            <p className="about-text">
              If you are outside the United States, please visit{' '}
              <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4A90E2', textDecoration: 'underline' }}>findahelpline.com</a>{' '}
              to find a crisis helpline in your country. Help is available worldwide.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Important Reminder</h2>
            <p className="about-text">
              Echo is an AI companion and is <strong>not</strong> a replacement for professional mental health care. If you are experiencing a mental health crisis, please reach out to a qualified professional or one of the resources listed above. You deserve real, human support.
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CrisisResources;

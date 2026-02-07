import React from 'react';
import Navigation from './Navigation';
import MorningTide from './MorningTide';
import Footer from './Footer';
import './Page.css';

const TermsOfService = () => {
  return (
    <div className="page">
      <MorningTide />
      <Navigation />
      <div className="page-content">
        <h1 className="page-title">Terms of Service</h1>
        <div className="page-body privacy-policy-content">

          <div className="privacy-section">
            <h2 className="about-subtitle">Acceptance of Terms</h2>
            <p className="about-text">
              By accessing or using EarMeOut ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Description of Service</h2>
            <p className="about-text">
              EarMeOut provides an AI-powered mental health companion ("Echo") designed to offer emotional support and a safe space for expression. The Service is intended for general wellness and emotional support purposes only.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Important Disclaimer — Not Medical Advice</h2>
            <p className="about-text">
              <strong>Echo is an AI companion and is NOT a licensed therapist, psychologist, psychiatrist, or medical professional.</strong> The Service does not provide medical advice, diagnoses, or treatment. Nothing provided through the Service should be construed as professional medical, psychological, or psychiatric advice.
            </p>
            <p className="about-text">
              If you are experiencing a mental health crisis, suicidal thoughts, or are in immediate danger, please contact emergency services (911) or the 988 Suicide & Crisis Lifeline immediately.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">User Responsibilities</h2>
            <ul className="privacy-list">
              <li>You must be at least 13 years old to use the Service</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree not to use the Service for any unlawful purpose</li>
              <li>You understand that Echo is an AI and its responses should not be taken as professional advice</li>
              <li>You agree not to attempt to extract harmful, illegal, or inappropriate content from the AI</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">AI Limitations</h2>
            <p className="about-text">
              Echo is powered by artificial intelligence and has inherent limitations. It may occasionally provide inaccurate, incomplete, or unhelpful responses. EarMeOut makes no guarantees about the accuracy, reliability, or appropriateness of Echo's responses. Always use your own judgment and seek professional help when needed.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Data Handling</h2>
            <p className="about-text">
              Your conversations with Echo are stored to maintain context within your sessions. Please review our <a href="/privacy" style={{ color: '#4A90E2', textDecoration: 'underline' }}>Privacy Policy</a> for complete details on how we handle your data. Do not share sensitive personal information (such as financial details, passwords, or government IDs) in your conversations.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Account Termination</h2>
            <p className="about-text">
              We reserve the right to suspend or terminate your account if you violate these Terms of Service or engage in behavior that is harmful to other users or the Service. You may delete your account at any time by contacting us.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Limitation of Liability</h2>
            <p className="about-text">
              EarMeOut and its team shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of the Service. The Service is provided "as is" without warranties of any kind.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Changes to Terms</h2>
            <p className="about-text">
              We may update these Terms of Service from time to time. Continued use of the Service after changes are posted constitutes your acceptance of the revised terms.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Contact</h2>
            <p className="about-text">
              If you have questions about these Terms of Service, please contact us through the information provided on our website.
            </p>
          </div>

          <div className="privacy-section">
            <p className="about-text" style={{ fontStyle: 'italic', marginTop: '2rem' }}>
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;

import React from 'react';
import Navigation from './Navigation';
import MorningTide from './MorningTide';
import Footer from './Footer';
import './Page.css';

const PrivacyPolicy = () => {
  return (
    <div className="page">
      <MorningTide />
      <Navigation />
      <div className="page-content">
        <h1 className="page-title">Privacy Policy</h1>
        <div className="page-body privacy-policy-content">
          <div className="privacy-section">
            <h2 className="about-subtitle">Introduction</h2>
            <p className="about-text">
              EarMeOut values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Information We Collect</h2>
            <p className="about-text">
              <strong>Account Information:</strong> When you create an account, we collect your email address and any other information you choose to provide, such as your name.
            </p>
            <p className="about-text">
              <strong>Conversation Data:</strong> We store your conversations with the chatbot to maintain context and improve your experience. These conversations are not actively monitored or reviewed by humans.
            </p>
            <p className="about-text">
              <strong>Usage Data:</strong> We may collect information about how you interact with our service, including access times, pages viewed, and features used.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">How We Use Your Information</h2>
            <p className="about-text">
              We use the information we collect to:
            </p>
            <ul className="privacy-list">
              <li>Provide, maintain, and improve our service</li>
              <li>Process your account registration and manage your account</li>
              <li>Maintain conversation context for your chatbot interactions</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Monitor and analyze usage patterns to improve our service</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Data Storage and Security</h2>
            <p className="about-text">
              Your conversations and account data are stored securely using industry-standard security measures. However, like any online service, we cannot guarantee absolute security or confidentiality. Data may be processed or stored to operate the platform, and we take reasonable steps to protect your information from unauthorized access, disclosure, alteration, or destruction.
            </p>
            <p className="about-text">
              <strong>Important:</strong> You should never share sensitive personal details, financial information, or other highly confidential information in your conversations. Any information you provide is shared at your own discretion and risk.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Data Sharing and Disclosure</h2>
            <p className="about-text">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="privacy-list">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations or respond to legal requests</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>With service providers who assist us in operating our platform (under strict confidentiality agreements)</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Third-Party Services</h2>
            <p className="about-text">
              Our service may use third-party services (such as authentication providers and cloud storage) that have their own privacy policies. We encourage you to review the privacy policies of these third-party services.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Your Rights</h2>
            <p className="about-text">
              You have the right to:
            </p>
            <ul className="privacy-list">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of certain data collection practices</li>
            </ul>
            <p className="about-text">
              To exercise these rights, please contact us through the contact information provided on our website.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Children's Privacy</h2>
            <p className="about-text">
              Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Changes to This Privacy Policy</h2>
            <p className="about-text">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="about-subtitle">Contact Us</h2>
            <p className="about-text">
              If you have any questions about this Privacy Policy, please contact us through the contact information provided on our website.
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

export default PrivacyPolicy;


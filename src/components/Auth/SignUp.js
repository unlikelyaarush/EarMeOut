import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MorningTide from '../MorningTide';
import Footer from '../Footer';
import './Auth.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!acceptedTerms) {
      setError('You must accept the Terms & Conditions to create an account');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await signUp(email, password, {
        full_name: fullName,
      });

      if (signUpError) {
        setError(signUpError.message || 'An error occurred during sign up');
      } else if (data?.session) {
        // User is automatically logged in
        navigate('/chat');
      } else if (data?.user) {
        // User created but no session - this should not happen
        setError('Account created but unable to log in. Please try logging in.');
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <MorningTide />
      <div className="auth-card">
        <h2>Sign up for EarMeOut</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <div className="terms-container">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                disabled={loading}
                required
              />
              <label htmlFor="terms" className="terms-label">
                I accept the{' '}
                <button
                  type="button"
                  className="terms-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTerms(!showTerms);
                  }}
                >
                  Terms & Conditions
                </button>
              </label>
            </div>
            {showTerms && (
              <div className="terms-content">
                <h3>Terms & Conditions</h3>
                <p>
                  By using EarMeOut, you acknowledge and agree that this platform is a free, nonprofit service designed solely to provide users with a safe space to express themselves and vent. EarMeOut is not a medical, therapeutic, or crisis intervention service, nor is it a substitute for professional advice, diagnosis, or treatment of any kind. The chatbot responses are generated automatically and may not be accurate, complete, or appropriate for every situation. They should never be relied upon fully as guidance for mental health, medical, legal, financial, or personal decision-making. If you are in distress, experiencing a crisis, or considering self-harm, you must immediately contact a qualified professional or your local emergency services.
                </p>
                <p>
                  To the fullest extent permitted by law, EarMeOut and its operators, volunteers, and affiliates disclaim all responsibility and liability for any actions, decisions, or outcomes that may result from use of this service. By engaging with the chatbot, you agree that you are solely responsible for your own choices, interpretations, and actions, and you release EarMeOut from any and all claims, damages, or liabilities, whether direct, indirect, incidental, or consequential. EarMeOut does not guarantee the accuracy, availability, or reliability of the chatbot and reserves the right to suspend, modify, or discontinue the service at any time without notice.
                </p>
                <h4>Privacy:</h4>
                <p>
                  EarMeOut values your privacy. Conversations with the chatbot are not actively monitored or reviewed by humans, and personal identifying information is not requested. However, like any online service, data may be processed or stored to operate the platform. EarMeOut makes no guarantee of absolute confidentiality or security, and by using the service, you understand and accept these limitations. You should never share sensitive personal details, and any information you provide is shared at your own discretion and risk.
                </p>
                <button
                  type="button"
                  className="terms-close"
                  onClick={() => setShowTerms(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
          <button type="submit" disabled={loading || !acceptedTerms} className="auth-button">
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
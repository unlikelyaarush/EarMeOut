import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import MorningTide from '../MorningTide';
import Footer from '../Footer';
import './Auth.css';

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Supabase automatically handles email confirmation via URL hash fragments
        // The onAuthStateChange listener will detect the session once confirmed
        // We just need to check if we have a session after a brief moment
        const checkSession = async () => {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            setStatus('error');
            setError(sessionError.message || 'Failed to verify email. Please try again.');
            return;
          }

          if (session?.user) {
            // Check if email is confirmed
            if (session.user.email_confirmed_at) {
              setStatus('success');
              setTimeout(() => {
                navigate('/chat');
              }, 2000);
            } else {
              // Wait a bit more for the confirmation to process
              setTimeout(checkSession, 1000);
            }
          } else {
            // No session yet, wait a moment and check again
            setTimeout(async () => {
              const { data: { session: retrySession } } = await supabase.auth.getSession();
              if (retrySession?.user?.email_confirmed_at) {
                setStatus('success');
                setTimeout(() => {
                  navigate('/chat');
                }, 2000);
              } else {
                setStatus('error');
                setError('Invalid or expired confirmation link. Please check your email and try the link again, or request a new confirmation email.');
              }
            }, 2000);
          }
        };

        // Give Supabase a moment to process the hash fragment
        setTimeout(checkSession, 500);
      } catch (err) {
        console.error('Email confirmation error:', err);
        setStatus('error');
        setError('An unexpected error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div className="auth-container">
      <MorningTide />
      <div className="auth-card">
        <h2>Email Confirmation</h2>
        {status === 'verifying' && (
          <div className="auth-message">
            <p>Verifying your email address...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="auth-success">
            <h3>Email confirmed!</h3>
            <p>Your email has been successfully verified. Redirecting you to the chat...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="auth-error">
            <h3>Verification failed</h3>
            <p>{error}</p>
            <button 
              onClick={() => navigate('/login')} 
              className="auth-button"
              style={{ marginTop: '1rem' }}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EmailConfirmation;


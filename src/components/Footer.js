import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h2 className="footer-brand">EarMeOut</h2>
          <p className="footer-mission">
            A nonprofit initiative dedicated to making mental health support accessible to everyone, everywhere.
          </p>
        </div>
        
        <div className="footer-right">
          <nav className="footer-nav">
            <Link to="/events" className="footer-link">Events</Link>
            <Link to="/privacy" className="footer-link">Privacy</Link>
            <Link to="/terms" className="footer-link">Terms</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </nav>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2025 EarMeOut Nonprofit. All rights reserved.
        </p>
        <p className="footer-made-with">
          For mental health awareness.
        </p>
      </div>
    </footer>
  );
};

export default Footer;


import React from 'react';
import Navigation from './Navigation';
import Iridescence from './Iridescence';
import Footer from './Footer';
import './Page.css';

const About = () => {
  return (
    <div className="page">
      <Iridescence
        color={[0, .3, .5]}
        mouseReact={false}
        amplitude={0.1}
        speed={.4}
      />
      <Navigation />
      <div className="page-content">
        <h1 className="page-title">About Us</h1>
        <div className="about-content">
          <div className="about-section">
            <p className="about-intro">
              At EarMeOut, we believe everyone deserves a safe space to be heard. We are a nonprofit organization dedicated to supporting mental wellness by providing free, accessible tools that encourage self-expression, stress relief, and resilience.
            </p>
          </div>
          
          <div className="about-section">
            <h2 className="about-subtitle">Our Platform</h2>
            <p className="about-text">
              Our online platform features a chatbot where users can freely vent their thoughts in a judgment-free environment. In addition, we offer guided breathing exercises and mindfulness practices to help individuals manage stress in healthy and practical ways.
            </p>
          </div>
          
          <div className="about-section">
            <h2 className="about-subtitle">Our Mission</h2>
            <p className="about-text">
              We are committed to making mental wellness approachable, stigma-free, and available to all. By combining technology with compassion, EarMeOut empowers people to take small, positive steps toward better emotional well-being every day.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;

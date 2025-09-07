import React from 'react';
import Navigation from './Navigation';
import './Page.css';

const About = () => {
  return (
    <div className="page">
      <Navigation />
      <div className="page-content">
        <h1 className="page-title">About EarMeOut</h1>
        <div className="page-body">
          <p>This is the About page. Content will be added here soon.</p>
        </div>
      </div>
    </div>
  );
};

export default About;

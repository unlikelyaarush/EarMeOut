import React from 'react';
import Navigation from './Navigation';
import './Page.css';

const Team = () => {
  return (
    <div className="page">
      <Navigation />
      <div className="page-content">
        <h1 className="page-title">Our Team</h1>
        <div className="page-body">
          <p>This is the Team page. Content will be added here soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Team;

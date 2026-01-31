import React from 'react';
import Navigation from './Navigation';
import MorningTide from './MorningTide';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <MorningTide speed={1.0} />
      <Navigation />
    </div>
  );
};

export default Homepage;
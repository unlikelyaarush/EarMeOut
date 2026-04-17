import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import MorningTide from './MorningTide';
import HeroScrollScene from './HeroScrollScene';
import Footer from './Footer';
import './Homepage.css';

const Homepage = () => {
  const { user } = useAuth();

  return (
    <div className="homepage">
      <MorningTide speed={1.0} />
      <Navigation />
      <HeroScrollScene user={user} />
      <Footer />
    </div>
  );
};

export default Homepage;

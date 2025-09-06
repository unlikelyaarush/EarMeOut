import React from 'react';
import SplitText from './SplitText';
import './Homepage.css';

const Homepage = () => {
  const handleAnimationComplete = () => {
    console.log('Welcome text animation completed!');
  };

  return (
    <div className="homepage">
      <SplitText
        text="Welcome to Ear Me Out"
        className="welcome-text"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        tag="h1"
        onLetterAnimationComplete={handleAnimationComplete}
      />
    </div>
  );
};

export default Homepage;
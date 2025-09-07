import React, { useState } from 'react';
import SplitText from './SplitText';
import FadeContent from './FadeContent';
import Navigation from './Navigation';
import './Homepage.css';

const Homepage = () => {
  const [textAnimationComplete, setTextAnimationComplete] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const handleAnimationComplete = () => {
    console.log('Welcome text animation completed!');
    setTextAnimationComplete(true);
    
    // Wait for slide-up animation to complete (0.8s) then show image
    setTimeout(() => {
      setShowImage(true);
    }, 800);
  };

  return (
    <div className="homepage">
      <Navigation />
      <div className="content-container">
        <div className={`text-container ${textAnimationComplete ? 'slide-up' : ''}`}>
          {!textAnimationComplete ? (
            <SplitText
              text="Welcome to EarMeOut"
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
          ) : (
            <h1 className="welcome-text">Welcome to EarMeOut</h1>
          )}
        </div>
        
        {showImage && (
          <FadeContent
            delay={0}
            duration={1.0}
            threshold={0.1}
            rootMargin="-50px"
            className="bot-image-container"
          >
            <img 
              src="/earmeout-bot.png" 
              alt="EarMeOut Bot" 
              className="bot-image"
            />
          </FadeContent>
        )}
      </div>
    </div>
  );
};

export default Homepage;
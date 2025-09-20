import React, { useState } from 'react';
import SplitText from './SplitText';
import FadeContent from './FadeContent';
import Navigation from './Navigation';
import './Homepage.css';

const Homepage = () => {
  const [textAnimationComplete, setTextAnimationComplete] = useState(false);
  const [showImage, setShowImage] = useState(true);

  const handleAnimationComplete = () => {
    console.log('Welcome text animation completed!');
    setTextAnimationComplete(true);
  };

  return (
    <div className="homepage">
      <Navigation />
      <div className="content-container">
        <div className="text-container">
          {!textAnimationComplete ? (
            <SplitText
              text="Welcome to EarMeOut"
              className="welcome-text"
              delay={37}
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
            <h1 
              className="welcome-text" 
              style={{
                textAlign: 'center',
                overflow: 'hidden',
                display: 'inline-block',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                willChange: 'transform, opacity'
              }}
            >
              Welcome to EarMeOut
            </h1>
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
        
        {showImage && (
          <FadeContent
            delay={500}
            duration={0.8}
            threshold={0.1}
            rootMargin="-50px"
            className="buttons-container"
          >
            <div className="homepage-buttons">
              <button 
                className="homepage-button primary-button"
                onClick={() => window.location.href = '/chat'}
              >
                Talk to Echo
              </button>
              <button 
                className="homepage-button secondary-button"
                onClick={() => window.open('https://hcb.hackclub.com/donations/start/earmeout', '_blank', 'noopener')}
              >
                Donate
              </button>
            </div>
          </FadeContent>
        )}
      </div>
    </div>
  );
};

export default Homepage;
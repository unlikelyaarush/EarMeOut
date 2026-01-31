import React, { useState } from 'react';
import SplitText from './SplitText';
import FadeContent from './FadeContent';
import Navigation from './Navigation';
import MorningTide from './MorningTide';
import Footer from './Footer';
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
      <MorningTide speed={1.0} />
      <Navigation />
      <div className="content-container">
        <div className="hero-content">
          <div className="hero-left">
            <FadeContent
              delay={200}
              duration={0.8}
              threshold={0.1}
              rootMargin="-50px"
            >
              <div className="status-badge">
                <span className="status-dot"></span>
                <span className="status-text">Always here, 24/7</span>
              </div>
            </FadeContent>

            <div className="text-container">
              {!textAnimationComplete ? (
                <SplitText
                  text="EarMeOut"
                  className="hero-heading"
                  delay={37}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="left"
                  tag="h1"
                  onLetterAnimationComplete={handleAnimationComplete}
                />
              ) : (
                <h1
                  className="hero-heading"
                  style={{
                    textAlign: 'left',
                    overflow: 'hidden',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    willChange: 'transform, opacity'
                  }}
                >
                  EarMeOut
                </h1>
              )}
            </div>

            <FadeContent
              delay={800}
              duration={0.8}
              threshold={0.1}
              rootMargin="-50px"
              className="hero-description"
            >
              <p className="description-text">
                Meet Echo, your free AI mental health companion. a safe, anonymous space to vent, reflect, and feel heard—whenever you need it.
              </p>
            </FadeContent>

            {showImage && (
              <FadeContent
                delay={1000}
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
                    Get Started &gt;
                  </button>
                  <button
                    className="homepage-button secondary-button"
                    onClick={() => window.open('https://hcb.hackclub.com/donations/start/earmeout', '_blank', 'noopener')}
                  >
                    Donate! &gt;
                  </button>
                </div>
              </FadeContent>
            )}
          </div>

          <div className="hero-right">
            {showImage && (
              <FadeContent
                delay={0}
                duration={1.0}
                threshold={0.1}
                rootMargin="-50px"
                className="bot-image-container"
              >
                <div className="bot-image-wrapper">
                  <img
                    src="/earmeout-bot.png"
                    alt="EarMeOut Bot"
                    className="bot-image"
                  />
                </div>
              </FadeContent>
            )}
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-content">
          <FadeContent
            delay={0}
            duration={0.8}
            threshold={0.1}
            rootMargin="-50px"
            className="info-heading-wrapper"
          >
            <h2 className="info-heading">
              Free Mental Health Services for Everyone, Everywhere
            </h2>
          </FadeContent>

          <FadeContent
            delay={200}
            duration={0.8}
            threshold={0.1}
            rootMargin="-50px"
            className="info-description-wrapper"
          >
            <p className="info-description">
              At EarMeOut, we believe that mental health support should be accessible to everyone, regardless of location or financial situation. We provide free, 24/7 access to AI-powered mental health services around the world, helping millions of people find support, guidance, and a safe space to express themselves.
            </p>
          </FadeContent>

          <div className="stats-container">
            <FadeContent
              delay={400}
              duration={0.8}
              threshold={0.1}
              rootMargin="-50px"
            >
              <div className="stat-box">
                <div className="stat-number">1M+</div>
                <div className="stat-label">Users Served</div>
              </div>
            </FadeContent>

            <FadeContent
              delay={500}
              duration={0.8}
              threshold={0.1}
              rootMargin="-50px"
            >
              <div className="stat-box">
                <div className="stat-number">150+</div>
                <div className="stat-label">Countries</div>
              </div>
            </FadeContent>

            <FadeContent
              delay={600}
              duration={0.8}
              threshold={0.1}
              rootMargin="-50px"
            >
              <div className="stat-box">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Available</div>
              </div>
            </FadeContent>

            <FadeContent
              delay={700}
              duration={0.8}
              threshold={0.1}
              rootMargin="-50px"
            >
              <div className="stat-box">
                <div className="stat-number">100%</div>
                <div className="stat-label">Free</div>
              </div>
            </FadeContent>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;
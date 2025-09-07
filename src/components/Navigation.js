import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          EarMeOut
        </Link>
        
        <div className="nav-center">
          <div 
            className="nav-buttons"
            onMouseLeave={() => {
              setPosition((pv) => ({
                ...pv,
                opacity: 0,
              }));
            }}
          >
            <NavTab 
              to="/" 
              isActive={location.pathname === '/'}
              setPosition={setPosition}
            >
              Home
            </NavTab>
            <NavTab 
              to="/about" 
              isActive={location.pathname === '/about'}
              setPosition={setPosition}
            >
              About
            </NavTab>
            <NavTab 
              to="/team" 
              isActive={location.pathname === '/team'}
              setPosition={setPosition}
            >
              Team
            </NavTab>
            <NavTab 
              to="/donate" 
              isActive={location.pathname === '/donate'}
              setPosition={setPosition}
            >
              Donate
            </NavTab>

            <SlidingCursor position={position} />
          </div>
        </div>
        
        <Link to="/chat" className="get-started-button">
          Get Started
        </Link>
      </div>
    </nav>
  );
};

const NavTab = ({ children, to, isActive, setPosition }) => {
  const ref = useRef(null);

  return (
    <Link
      ref={ref}
      to={to}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className={`nav-button ${isActive ? 'active' : ''}`}
    >
      {children}
    </Link>
  );
};

const SlidingCursor = ({ position }) => {
  return (
    <motion.div
      animate={{
        ...position,
      }}
      className="nav-cursor"
    />
  );
};

export default Navigation;

import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navigation.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">

        
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
            <a 
              href="https://hcb.hackclub.com/donations/start/earmeout" 
              target="_blank" 
              rel="noopener" 
              className={`nav-button ${location.pathname === '/donate' ? 'active' : ''}`}
              onMouseEnter={(e) => {
                const { width } = e.currentTarget.getBoundingClientRect();
                setPosition({ left: e.currentTarget.offsetLeft, width, opacity: 1 });
              }}
            >
              Donate
            </a>

            <SlidingCursor position={position} />
          </div>
        </div>
        
        <div className="nav-right">
          {!user ? (
            <Link to="/login" className="sign-in-button">
              Sign In
            </Link>
          ) : (
            <button onClick={handleLogout} className="sign-out-button">
              Log Out
            </button>
          )}
          <Link to="/chat" className="get-started-button">
            Get Started
          </Link>
        </div>
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

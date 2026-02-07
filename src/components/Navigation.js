import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import './Navigation.css';

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
    <nav className="navigation-new">
      <div className="navigation-container">
        <div className="nav-brand-container">
          <img
            src="/earmeout-bot.png"
            alt="EarMeOut"
            className="nav-brand-image"
          />
          <Link to="/" className="nav-brand">
            EarMeOut
          </Link>
        </div>
        <SlideTabs position={position} setPosition={setPosition} location={location} />

        <div className="navigation-right">
          {!user ? (
            <>
              {location.pathname !== '/' && (
                <Link to="/login" className="nav-sign-in">
                  Sign In
                </Link>
              )}
              <Link to="/chat" className="u-btn">
                <span className="u-btn__top">Get Started</span>
              </Link>
            </>
          ) : (
            <>
              <button onClick={handleLogout} className="logout-btn">
                <span className="logout-sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                  </svg>
                </span>
                <span className="logout-text">Logout</span>
              </button>
              <button
                className="profile-button"
                onClick={() => navigate('/profile')}
                aria-label="Go to profile settings"
              >
                <User size={22} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const SlideTabs = ({ position, setPosition, location }) => {
  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="slide-tabs"
    >
      <Tab setPosition={setPosition} to="/" isActive={location.pathname === '/'}>Home</Tab>
      <Tab setPosition={setPosition} to="/events" isActive={location.pathname === '/events'}>Events</Tab>
      <Tab setPosition={setPosition} to="/team" isActive={location.pathname === '/team'}>Team</Tab>
      <Tab setPosition={setPosition} href="https://hcb.hackclub.com/donations/start/earmeout" external>Donate</Tab>
      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({ children, setPosition, to, href, external, isActive }) => {
  const ref = useRef(null);

  const handleMouseEnter = () => {
    if (!ref?.current) return;
    const { width } = ref.current.getBoundingClientRect();
    setPosition({
      left: ref.current.offsetLeft,
      width,
      opacity: 1,
    });
  };

  const className = "slide-tab";

  if (external && href) {
    return (
      <li
        ref={ref}
        onMouseEnter={handleMouseEnter}
        className={className}
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </li>
    );
  }

  if (to) {
    return (
      <li
        ref={ref}
        onMouseEnter={handleMouseEnter}
        className={className}
      >
        <Link to={to}>
          {children}
        </Link>
      </li>
    );
  }

  return (
    <li
      ref={ref}
      onMouseEnter={handleMouseEnter}
      className={className}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="slide-cursor"
    />
  );
};

export default Navigation;

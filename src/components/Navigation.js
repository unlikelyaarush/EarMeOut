import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
        <SlideTabs position={position} setPosition={setPosition} location={location} />
        
        <div className="navigation-right">
          {!user ? (
            <Link to="/login" className="nav-sign-in">
              Sign In
            </Link>
          ) : (
            <button onClick={handleLogout} className="nav-sign-in">
              Log Out
            </button>
          )}
          <Link to="/chat" className="nav-get-started">
            Get Started
          </Link>
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
      <Tab setPosition={setPosition} to="/about" isActive={location.pathname === '/about'}>About</Tab>
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

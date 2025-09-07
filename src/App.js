import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import About from './components/About';
import Team from './components/Team';
import Chat from './components/Chat';
import Donate from './components/Donate';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/donate" element={<Donate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
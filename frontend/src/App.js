import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from './components/Chat';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Check if token exists on load
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    setIsLoggedIn(false); // Update state to show login/signup
  };

  const handleSignupSuccess = () => {
    setShowSignup(false); // Switch back to login after signup
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          AKASH <code>Ka ChatBot</code> <br />
          Powered by Prime Minister's AI Summit
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div className="App-content">
        {isLoggedIn ? (
          <Chat onLogout={handleLogout} />
        ) : showSignup ? (
          <Signup onSignup={handleSignupSuccess} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
        {!isLoggedIn && (
          <p className="toggle-link">
            {showSignup ? (
              <span onClick={() => setShowSignup(false)}>Back to Login</span>
            ) : (
              <span onClick={() => setShowSignup(true)}>Sign Up Here</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from './components/Chat';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          AKASH <code>Ka ChatBot</code> <br></br>Powered by Prime Minister's AI Summit
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
        {isLoggedIn ? <Chat /> : <Login onLogin={handleLogin} />}
      </div>
    </div>
  );
}

export default App;

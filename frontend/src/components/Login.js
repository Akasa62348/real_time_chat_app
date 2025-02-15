import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        username,
        password,
      });
      onLogin(response.data.token);
    } catch (error) {
      console.error('Login failed', error);
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="Login-container">
      <h2>Spiritual Gateway</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your spiritual name"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your sacred password"
      />
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleLogin}>Enter the Divine Realm</button>
    </div>
  );
};

export default Login;

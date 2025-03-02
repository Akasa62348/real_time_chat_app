import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const Signup = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        username,
        password,
      });
      setSuccess(response.data.msg); // "User registered successfully"
      setError('');
      setTimeout(() => {
        onSignup(); // Redirect to login after successful signup
      }, 1500); // Delay to show success message
    } catch (error) {
      console.error('Signup failed', error);
      setError(error.response?.data?.msg || 'Signup failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="Signup-container">
      <h2>Join the Divine Realm</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Choose your spiritual name"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create your sacred password"
      />
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button onClick={handleSignup}>Begin Your Journey</button>
    </div>
  );
};

export default Signup;
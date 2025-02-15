import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../App.css';

const socket = io(process.env.REACT_APP_API_URL);

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === '') {
      setError('Message cannot be empty');
      return;
    }
    socket.emit('sendMessage', message);
    setMessage('');
    setError('');
  };

  return (
    <div className="Chat-container">
      <h2>Divine Chat Room</h2>
      <div className="Chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="Chat-message">
            <p>{msg}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your divine message"
      />
      {error && <p className="error-message">{error}</p>}
      <button onClick={sendMessage}>Send to the Universe</button>
    </div>
  );
};

export default Chat;

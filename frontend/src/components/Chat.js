import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../App.css';

const socket = io('https://pradhanmantri-ka-chatbot.onrender.com', {
  reconnection: true,
  transports: ['websocket', 'polling'],
});

const Chat = ({ onLogout }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('receiveMessage', (message) => {
      console.log('Received full message:', message);
      setMessages((prevMessages) => [...prevMessages, `AI: ${message}`]);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to the server.');
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('connect');
      socket.off('connect_error');
    };
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      console.log('Scrolling to bottom, height:', messagesContainerRef.current.scrollHeight);
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() === '') {
      setError('Message cannot be empty');
      return;
    }
    console.log('Sending full message:', message);
    socket.emit('sendMessage', message);
    setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
    setMessage('');
    setError('');
  };

  const handleLogout = () => {
    socket.disconnect();
    onLogout();
  };

  return (
    <div className="Chat-container">
      <h2>Divine Chat Room</h2>
      <div className="Chat-messages" ref={messagesContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className="Chat-message">
            <p>{msg}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your divine message"
      />
      {error && <p className="error-message">{error}</p>}
      <button onClick={sendMessage}>Send to the Universe</button>
      <button onClick={handleLogout} className="logout-button">
        Leave the Divine Realm
      </button>
    </div>
  );
};

export default Chat;
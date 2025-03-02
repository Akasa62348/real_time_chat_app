require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { callMistralAPI } = require('./utils/mistralAPI');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://pradhanmantrikachatbot.netlify.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Configure Express CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://pradhanmantrikachatbot.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use('/api/auth', authRoutes);

// MongoDB connection
const { MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('sendMessage', async (message) => {
    try {
      const response = await callMistralAPI(message);
      console.log('Mistral API response:', response);
      io.emit('receiveMessage', response);
    } catch (error) {
      console.error('Socket error:', error);
      io.emit('receiveMessage', 'Sorry, I couldn\'t process that.');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
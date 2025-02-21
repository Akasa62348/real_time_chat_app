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
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST'],
  },
});

// Use CORS middleware
app.use(cors({
  origin: '*', // Allow all origins for testing; replace with your frontend's origin in production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api/auth', authRoutes);

// MongoDB connection
const { MONGODB_URI } = process.env;
console.log('MongoDB URI:', MONGODB_URI); // Log the MongoDB URI for verification

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', async (message) => {
    try {
      const response = await callMistralAPI(message);
      io.emit('receiveMessage', response);
    } catch (error) {
      console.error('Error processing message:', error);
      io.emit('receiveMessage', 'Sorry, I couldn\'t process that.');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message'); // Import Message model

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const path = require('path');

// ...

// Middleware
app.use(cors({
  origin: ["https://joyful-gaufre-719afc.netlify.app", "http://localhost:5173", "http://localhost:5175", "http://consultpro.vanshraturi.me", "https://consultpro.vanshraturi.me"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: ["https://joyful-gaufre-719afc.netlify.app", "http://localhost:5173", "http://localhost:5175", "http://consultpro.vanshraturi.me", "https://consultpro.vanshraturi.me"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
  });

  socket.on('send_message', async (data) => {
    // data: { sender, recipient, content, room }
    if (data.sender && data.recipient && data.content) {
      try {
        const newMessage = await Message.create({
          sender: data.sender,
          recipient: data.recipient,
          content: data.content,
          fileUrl: data.fileUrl,
          messageType: data.messageType
        });
        socket.to(data.room).emit('receive_message', data);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  });

  socket.on('callUser', (data) => {
    // data: { userToCall, signalData, from, name }
    io.to(data.userToCall).emit('callUser', { 
      signal: data.signalData, 
      from: data.from, 
      name: data.name,
      callType: data.callType // Pass the callType (video/audio)
    });
  });

  socket.on('answerCall', (data) => {
    // data: { to, signal }
    io.to(data.to).emit('callAccepted', data.signal);
  });

  socket.on('iceCandidate', (data) => {
    // data: { to, candidate }
    io.to(data.to).emit('iceCandidate', data.candidate);
  });

  socket.on('endCall', (data) => {
    // data: { to }
    io.to(data.to).emit('callEnded');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    socket.broadcast.emit('callEnded'); // Notify others if user disconnects abruptly
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//
// server restart trigger

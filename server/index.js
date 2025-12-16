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

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Placeholders
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/experts', require('./routes/expertRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/turn', require('./routes/turnRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

const io = new Server(server, {
  cors: {
    origin: ["https://joyful-gaufre-719afc.netlify.app", "http://localhost:5173", "http://localhost:5175", "http://consultpro.vanshraturi.me", "https://consultpro.vanshraturi.me"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Track online users
const onlineUsers = new Map(); // userId -> Set(socketIds) because user might have multiple tabs

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.userData = userData; // Store user data on socket for disconnect handling
    
    // Add socket id to user's set of sockets
    if (!onlineUsers.has(userData._id)) {
        onlineUsers.set(userData._id, new Set());
    }
    onlineUsers.get(userData._id).add(socket.id);
    
    // Emit only keys (userIds) as online
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

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

    // Remove user from online tracking
    if (socket.userData && socket.userData._id) {
        const userId = socket.userData._id;
        if (onlineUsers.has(userId)) {
            onlineUsers.get(userId).delete(socket.id);
            if (onlineUsers.get(userId).size === 0) {
                onlineUsers.delete(userId);
            }
        }
        io.emit('online_users', Array.from(onlineUsers.keys()));
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//
// server restart trigger

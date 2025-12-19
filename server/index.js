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
  origin: ["https://joyful-gaufre-719afc.netlify.app", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://consultpro.vanshraturi.me", "https://consultpro.vanshraturi.me"],
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
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

// Cron Job for Appointment Reminders (Every minute)
const cron = require('node-cron');
const Appointment = require('./models/Appointment');
const Notification = require('./models/Notification');

cron.schedule('* * * * *', async () => {
    try {
        const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
        const elevenMinutesFromNow = new Date(Date.now() + 11 * 60 * 1000);

        // Calculate 10 minutes from now (start of the minute)
        const now = new Date();
        const tenMinLater = new Date(now.getTime() + 10 * 60000);
        
        // Format to match stored Date (YYYY-MM-DDT00:00:00.000Z usually) and Time HH:MM
        // Since Date is stored as Date object usually set to midnight or specific time, 
        // and startTime is string, checking is complex.
        
        // Strategy: 
        // 1. Find appointments where date is TODAY (ignoring time component of date object)
        // 2. Filter by startTime matching 10 mins from now.
        
        const startOfDay = new Date(tenMinLater.setHours(0,0,0,0));
        const endOfDay = new Date(tenMinLater.setHours(23,59,59,999));
        
        const targetTime = `${tenMinLater.getHours().toString().padStart(2, '0')}:${tenMinLater.getMinutes().toString().padStart(2, '0')}`;
        
        const appointments = await Appointment.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            startTime: targetTime,
            status: 'confirmed'
        }).populate('customer expert');

        for (const apt of appointments) {
            // Check if notification already sent to avoid duplicates (optional optimization)
            
            // Notify Customer
            await Notification.create({
                recipient: apt.customer._id,
                type: 'reminder',
                message: `Reminder: Your session with ${apt.expert.name} starts in 10 minutes.`,
                link: '/dashboard'
            });
            
            // Notify Expert
            await Notification.create({
                recipient: apt.expert._id,
                type: 'reminder',
                message: `Reminder: Session with ${apt.customer.name} starts in 10 minutes.`,
                link: '/dashboard'
            });
            
            // Optional: Emit socket event if we had access to IO here (needs restructuring to access IO globally or pass it)
            // For now, these will be picked up on next fetch or we can attach IO to app/global.
        }
    } catch (error) {
        console.error('Cron job error:', error);
    }
});

const io = new Server(server, {
  cors: {
    origin: ["https://joyful-gaufre-719afc.netlify.app", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://consultpro.vanshraturi.me", "https://consultpro.vanshraturi.me"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io accessible to our router
app.set('io', io);

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
        
        // Create Notification for Recipient
        const Notification = require('./models/Notification');
        await Notification.create({
            recipient: data.recipient,
            sender: data.sender,
            type: 'message', 
            message: `New message from ${data.senderName || 'user'}`, // Ideally sender name should be passed in data
            link: `/chat/${data.sender}`
        });
        
        // Emit 'notification' event to the recipient so the bell rings
        io.to(data.recipient).emit('notification', {
            type: 'message',
            message: `New message`
        });
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

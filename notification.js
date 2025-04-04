// notification-service/index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());
app.use(express.json());

const connectedUsers = new Map();

// لما اليوزر يتصل
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    connectedUsers.set(userId, socket);
    console.log(`✅ User ${userId} connected`);
  }

  socket.on('disconnect', () => {
    connectedUsers.delete(userId);
    console.log(`❌ User ${userId} disconnected`);
  });
});

// Endpoint نستخدمه من Postman عشان نبعِت إشعار
app.post('/send', (req, res) => {
  const { userId, message } = req.body;
  const socket = connectedUsers.get(userId);
  if (socket) {
    socket.emit('notification', message);
    return res.json({ success: true, message: '📬 Notification sent' });
  } else {
    return res.status(404).json({ success: false, message: 'User not connected' });
  }
});

server.listen(4000, () => {
  console.log('🔔 Notification Service running on http://localhost:4000');
});

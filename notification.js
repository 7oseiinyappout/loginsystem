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
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, []);
    }
    connectedUsers.get(userId).push(socket);
    console.log(`✅ User ${userId} connected. Total sockets: ${connectedUsers.get(userId).length}`);

    socket.on('disconnect', () => {
      const sockets = connectedUsers.get(userId) || [];
      const updatedSockets = sockets.filter(s => s !== socket);
      if (updatedSockets.length === 0) {
        connectedUsers.delete(userId);
        console.log(`❌ User ${userId} disconnected (all sockets closed)`);
      } else {
        connectedUsers.set(userId, updatedSockets);
        console.log(`⚠️ Socket disconnected. Remaining sockets for ${userId}: ${updatedSockets.length}`);
      }
    });
  }
});

// Endpoint نستخدمه من Postman عشان نبعِت إشعار
app.post('/sendnotification', (req, res) => {
  const { userId, message } = req.body;
  const sockets = connectedUsers.get(userId);

  if (sockets && sockets.length > 0) {
    sockets.forEach(s => {
      s.emit('notification', message);
    });

    return res.json({ success: true, message: '📬 Notification sent' });
  } else {
    return res.status(404).json({ success: false, message: '❌ No connected sockets for this user' });
  }
});

server.listen(4000, () => {
  console.log('🔔 Notification Service running on http://localhost:4000');
});

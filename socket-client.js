// socket-client.js
const io = require('socket.io-client');

const socket = io('http://localhost:4000', {
  query: {
    userId: 'user12333'
  }
});

socket.on('connect', () => {
  console.log('🟢 Connected to notification service');
});

socket.on('notification', (msg) => {
  console.log('📩 Notification Received:', msg);
});

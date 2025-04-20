process.on('unhandledRejection', (err) => {
    console.error('💥 Unhandled Rejection:', err);
    process.exit(1); // انهي التطبيق عشان مايبقاش في حالة غير مستقرة
});

process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    process.exit(1);
});
require('express-async-errors');
const path = require('path');

////////////////////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const cors = require("cors");
const router = require('./src/routes/appRouter');
const { connectDB } = require('./src/configs/mongoDB');
const errorHandler = require('./src/middlewares/errorHandling');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*'
    }
});

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

connectDB()
// awsS3()
const staticPath = path.join(__dirname, 'out'); // Adjusted the path to 'out'
app.use(express.static(staticPath));

app.use("/api", router)
app.get('*', (req, res) => {
    const filePath = path.join(staticPath, `${req.path}.html`);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.sendFile(path.join(staticPath, 'index.html'));
        }
    });
});

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

app.use(errorHandler); // بعد جميع الـ routes

server.listen(3000, () => {
    console.log('🔔 Notification Service and API running on http://localhost:3000');
});
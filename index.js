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
const app = express();

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

app.use(errorHandler); // بعد جميع الـ routes

app.listen(3000, () => { console.log("listening") });
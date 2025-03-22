const mongoose = require('mongoose');
const url='mongodb+srv://admin:itiAmazon@cluster0.ke6bvtv.mongodb.net/new25'

const connectDB = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;

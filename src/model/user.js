const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    userName:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true 
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    number: {
        type: Number
    }
}, {
    timestamps: true
})
    ;

const User = mongoose.model('User', UserSchema);

module.exports = User;

const mongoose = require('mongoose');

const ClipboardSchema = new mongoose.Schema({
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

}, {
    timestamps: true
})
    ;

const Clipboard = mongoose.model('Clipboard', ClipboardSchema);

module.exports = Clipboard;

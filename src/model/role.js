const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({

    name: { type: String, required: true, unique: true },
    permissions: [{ type: String, required: true }] // List of allowed actions

}, {
    timestamps: true
})


const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;

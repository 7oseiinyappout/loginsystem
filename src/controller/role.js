const Role = require("../model/role");

exports.createRole = async (req, res) => {
    try {
        let role = await Role.create(req.body);
        res.send({ message: "role created", data: role });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
exports.getAllRole = async (req, res) => {
    try {
        let roles = await Role.find({});
        res.send({ message: "all roles", data: roles });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
exports.getRoleByName = async (req, res) => {
    try {
        let role = await Role.findOne({name: req.body.name});
        res.send({ message: "role by name", data: role });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
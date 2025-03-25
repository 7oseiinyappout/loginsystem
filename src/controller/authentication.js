const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../model/user');
const Role = require('../model/role');

exports.register = async (req, res, err) => {

    try {
        const user = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        const role = await Role.findOne({ name: req.body.roleName });
        if (!role) return res.status(400).json({ message: "Invalid role" });
        const User = await userModel.create({ ...user, password: hashedPassword, role: role._id});

        res.send({
            message: "User registered successfully",
            data: User
        })
    } catch (err) {
        res.send({
            message: err.message,
        })
    }
}
exports.login = async (req, res, err) => {
    const { ref, password } = req.body

    try {
        const user = await userModel.findOne({
            $or: [
                { email: ref },
                { userName: ref }
            ]
        }).lean()
        if (!user) return res.status(404).send({ message: 'invalid credentials' })
        let validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(400).send({ message: 'invalid credentials' })
        const token = jwt.sign({ _id: user._id, role: user.role }, 'SECRET_KEY', { expiresIn: "2h" });
        delete user.password
        res.send({ token, user })
    } catch (err) { return }

}
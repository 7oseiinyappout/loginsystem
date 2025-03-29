const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../model/user');
const Role = require('../model/role');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'ahmedappout@gmail.com',  // ضع بريدك الإلكتروني هنا
        pass: 'fpxe lgck pnhb nosc'   // ضع كلمة المرور أو App Password
    }
});
exports.register = async (req, res, err) => {

    try {
        const user = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        const role = await Role.findOne({ name: req.body.roleName });
        if (!role) return res.status(400).json({ message: "Invalid role" });
        const User = await userModel.create({ ...user, password: hashedPassword, role: role._id});

        const token = jwt.sign({ _id: user._id, role: user.role , email: user.email }, 'SECRET_KEY', { expiresIn: "1h" });
        await this.sendVerificationEmail(user.email, token);

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
        if (!user.isVerified) return res.status(403).json({ message: "يجب تفعيل الحساب أولاً" });
        let validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(400).send({ message: 'invalid credentials' })
        const token = jwt.sign({ _id: user._id, role: user.role }, 'SECRET_KEY', { expiresIn: "2h" });
        delete user.password
        res.send({ token, user })
    } catch (err) { return }

}
exports.sendVerificationEmail  = async (email, token) => {
    const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: 'ahmedappout@gmail.com',
        to: email,
        subject: "تأكيد حسابك",
        html: `<p>اضغط على الرابط التالي لتأكيد حسابك:</p> 
               <a href="${verificationUrl}">تفعيل الحساب</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ تم إرسال البريد الإلكتروني بنجاح");
    } catch (error) {
        console.error("❌ فشل إرسال البريد الإلكتروني:", error);
    }

}
exports.verifyEmail  = async (req, res) => {
    try {
        const { token } = req.query;

        // التحقق من صحة التوكن
        const decoded = jwt.verify(token, 'SECRET_KEY');

        const user = await userModel.findOne({ email: decoded.email });
        if (!user) return res.status(400).json({ message: "invaled url" });

        // تحديث حالة التحقق
        user.isVerified = true;
        await user.save();

        res.json({ message: "تم تفعيل الحساب بنجاح! يمكنك الآن تسجيل الدخول." });
    } catch (error) {
        res.status(400).json({ message: "رابط التحقق غير صالح أو منتهي الصلاحية" });
    }
}
exports.userInfo  = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id :req.user._id }).populate('role');
        if (!user) return res.status(400).json({ message: "invaled user" });
        res.send(user);
    } catch (error) {
        res.status(400).json({ message: "invaled token" });
    }
}
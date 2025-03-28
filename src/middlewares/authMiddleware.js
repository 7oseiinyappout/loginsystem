const jwt = require('jsonwebtoken');
const User = require('../model/user');
exports.authMiddleware=(req,res,next)=>{
   try{
    const token = req.header('Authorization')
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token.split(" ")[1], 'SECRET_KEY');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
    //next()
   }catch(err){
    res.status(401).json({ message: "Access Denied" });
    }
}

exports.authorize=(requiredPermission)=>async(req,res,next)=>{
    try {
        const user = await User.findById(req.user._id).populate("role"); 
        req.user.role = user.role

        if (!user || !user.role) {
            return res.status(403).json({ message: "Access denied. No role assigned." });
        }

        if (!((user.role.permissions.includes(requiredPermission)) || (requiredPermission==user.role.name))) {

            return res.status(403).json({ message: `${user.role.name} not have permission to ` });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
 }
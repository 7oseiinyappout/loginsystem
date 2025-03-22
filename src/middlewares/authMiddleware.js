const jwt = require('jsonwebtoken');
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
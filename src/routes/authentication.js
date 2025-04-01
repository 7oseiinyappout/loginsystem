const express=require('express');
const router = express.Router();
const authenticationController= require('../controller/authentication');
const mw= require('../middlewares/authMiddleware');


router.post('/register', authenticationController.register);
router.post('/login', authenticationController.login);
router.get("/verify-email", authenticationController.verifyEmail);
router.get("/user-info",mw.authMiddleware, authenticationController.userInfo);

router.all('*', (req,res,err)=>{
    res.send('authentication api not found')
});
module.exports =router
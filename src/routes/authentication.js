const express=require('express');
const router = express.Router();
const authenticationController= require('../controller/authentication');


router.post('/register', authenticationController.register);
router.post('/login', authenticationController.login);
router.get("/verify-email", authenticationController.verifyEmail);

router.all('*', (req,res,err)=>{
    res.send('authentication api not found')
});
module.exports =router
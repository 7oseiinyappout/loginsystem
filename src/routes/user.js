const express=require('express');
const router = express.Router();
const userController= require('../controller/user');


router.options('/', userController.options);
router.get('/', userController.getall);
router.get('/getOne', userController.getOne);

router.get('*', (req,res,err)=>{
    res.send('user api not found')
});
module.exports =router
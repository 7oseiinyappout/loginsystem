const express=require('express');
const router = express.Router();
const userController= require('../controller/user');
const middlewares= require('../middlewares/authMiddleware');


router.options('/', userController.options);
router.get('/', userController.getall);
router.get('/getOne', userController.getOne);
router.get('/getpass',middlewares.authMiddleware,middlewares.authorize("super admin"), userController.getPassword);

router.get('*', (req,res,err)=>{
    res.send('user api not found')
});
module.exports =router
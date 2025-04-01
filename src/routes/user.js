const express=require('express');
const router = express.Router();
const userController= require('../controller/user');
const middlewares= require('../middlewares/authMiddleware');
const {multer}= require('../utils/reusableFunctions');


router.options('/', userController.options);
router.get('/', userController.getall);
router.get('/getOne', userController.getOne);
router.get('/getpass',middlewares.authMiddleware,middlewares.authorize("super admin"), userController.getPassword);
router.post('/edit-image',middlewares.authMiddleware,multer.single('profileImage'), userController.editImage);
router.post('/edit-image-s3',middlewares.authMiddleware,multer.single('profileImage'), userController.editImage);

router.get('*', (req,res,err)=>{
    res.send('user api not found')
});
module.exports =router
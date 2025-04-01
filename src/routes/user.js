const express=require('express');
const router = express.Router();
const userController= require('../controller/user');
const mw= require('../middlewares/authMiddleware');
const {multer}= require('../utils/reusableFunctions');
const {uploadS3}= require('../utils/multerS3');


router.options('/', userController.options);
router.get('/', userController.getall);
router.get('/getOne', userController.getOne);
router.get('/getpass',mw.authMiddleware,mw.authorize("super admin"), userController.getPassword);
router.post('/edit-image',mw.authMiddleware,multer.single('profileImage'), userController.editImage);
router.post('/edit-image-s3',mw.authMiddleware,uploadS3.single('profileImage'), userController.editImage);
router.post('/remove-image-s3',mw.authMiddleware, userController.removeImage);

router.get('*', (req,res,err)=>{
    res.send('user api not found')
});
module.exports =router
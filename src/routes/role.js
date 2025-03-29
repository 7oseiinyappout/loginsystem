const express=require('express');
const router = express.Router();
const roleController= require('../controller/role');
const middlewares= require('../middlewares/authMiddleware');


router.post('/', roleController.createRole);
router.get('/', roleController.getAllRole);
router.get('/getRoleByName', roleController.getRoleByName);
router.post('/editPermissions',middlewares.authMiddleware,middlewares.authorize('editrole'),roleController.editPermissions);


router.get('*', (req,res,err)=>{
    res.send('role api not found')
});
module.exports =router
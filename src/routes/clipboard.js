const express=require('express');
const router = express.Router();
const clipboardController= require('../controller/clipboard');
const mw= require('../middlewares/authMiddleware');
const s3= require('../utils/multerS3');


router.post('/', 
    mw.authMiddleware,
    s3.upload.single('file'),
    clipboardController.createClipboard
);

router.get('/', 
    mw.authMiddleware,
    clipboardController.getAllClipboard
);

router.delete('/', 
    mw.authMiddleware,
    clipboardController.deleteClipboard
);


router.get('*', (req,res,err)=>{
    res.send('clipboard api not found')
});
module.exports =router
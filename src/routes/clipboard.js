const express=require('express');
const router = express.Router();
const clipboardController= require('../controller/clipboard');
const mw= require('../middlewares/authMiddleware');


router.post('/', 
    mw.authMiddleware,
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
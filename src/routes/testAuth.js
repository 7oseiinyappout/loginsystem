const express=require('express');
const router = express.Router();
const testAuthController= require('../controller/testAuth');
const middlewares= require('../middlewares/authMiddleware');


router.get('/test',middlewares.authMiddleware ,testAuthController.test);


module.exports =router
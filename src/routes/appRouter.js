const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const roleRouter = require('./role');
const clipboardRouter = require('./clipboard');
const authenticationRouter = require('./authentication');
// Define API routes
router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// router.options('*',(req, res)=>{res.send("disabled now")} )
router.use('/auth',authenticationRouter )
router.use('/user',userRouter )
router.use('/role',roleRouter )
router.use('/clipboard',clipboardRouter )
router.get('*', (req, res) => {
    res.send('api not found');
});

module.exports = router;

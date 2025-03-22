const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const authenticationRouter = require('./authentication');
const testAuthRouter = require('./testAuth');
// Define API routes
router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// router.options('*',(req, res)=>{res.send("disabled now")} )
router.use('/user',userRouter )
router.use('/auth',authenticationRouter )
router.use('/testauth',testAuthRouter )
router.get('*', (req, res) => {
    res.send('api not found');
});

module.exports = router;

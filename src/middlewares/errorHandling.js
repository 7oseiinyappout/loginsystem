require('dotenv').config();

module.exports = (err, req, res, next) => {
    console.error(err.stack); // أو استخدم winston/logging tool
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';

    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `The ${field} '${err.keyValue[field]}' is already in use.`;
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' && {
            name: err.name,
            message: err.message,
            stack: err.stack,
            ...err
        } 
        // mainStack: err.mainStack
        // error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

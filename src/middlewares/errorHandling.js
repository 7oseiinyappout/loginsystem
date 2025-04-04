require('dotenv').config();

module.exports = (err, req, res, next) => {
    console.error(err.stack); // أو استخدم winston/logging tool
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';

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

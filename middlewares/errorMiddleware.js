const errorHandler = (err, req, res, next) => {
    console.error('Error occurred:', err.message);
  
    const statusCode = err.statusCode || 500; // Default to Internal Server Error
    res.status(statusCode).json({
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = errorHandler;
  
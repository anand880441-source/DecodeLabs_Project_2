// ===== Global Error Handler =====
const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  
  // Determine status code
  const status = err.status || 500;
  
  // Determine error message
  let message = err.message || 'Internal Server Error';
  
  // Avoid exposing internal errors in production
  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'An unexpected error occurred';
  }
  
  res.status(status).json({
    status: status,
    error: getErrorType(status),
    message: message,
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack 
    }),
    timestamp: new Date().toISOString()
  });
};

const getErrorType = (status) => {
  const errorTypes = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    429: 'Too Many Requests',
    500: 'Internal Server Error'
  };
  return errorTypes[status] || 'Unknown Error';
};

module.exports = { errorHandler };
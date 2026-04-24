// Fallback for 404 Not Found errors
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  // If the status code is still 200 despite an error, force it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  
  res.json({
    message: err.message,
    // Only show stack trace in development mode for security
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

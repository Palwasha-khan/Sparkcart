import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {

  // Prevent sending response twice
  if (res.headersSent) {
    return next(err);
  }

  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  };

  // Handle invalid mongoose ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    error = new ErrorHandler(message, 404);
  }

  // DEVELOPMENT
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: err,
      stack: err.stack,
    });
  }

  // PRODUCTION
  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

// Catch-all for routes that don't exist
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the global handler below
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
  // If the status code is 200 but an error reached here, force it to 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource not found or invalid ID format";
    statusCode = 404;
  }

  // Handle Mongoose Validation Errors (e.g., missing fields)
  if (err.name === "ValidationError") {
    // Extract all validation error messages and join them
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // Handle Mongoose Duplicate Key Error (e.g., registering an existing email)
  if (err.code === 11000) {
    message = "Duplicate field value entered. This record already exists.";
    statusCode = 400;
  }

  res.status(statusCode).json({
    message,
    // Only show the stack trace in development mode
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

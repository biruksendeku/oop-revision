class AppError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class BadRequestError extends AppError {
  constructor(message = "Invalid Request") {
    super(`${message}`, 400);
  }
}

class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} Not Found`, 404);
  }
}

export { AppError, BadRequestError, NotFoundError };

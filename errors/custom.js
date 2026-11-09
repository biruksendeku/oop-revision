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

class AccountAlreadyExistsError extends AppError {
  constructor(identifier = "Account") {
    super(`${identifier} already exists`, 409);
  }
}

class InsufficientFundsError extends AppError {
  constructor(available, requested) {
    super(
      `Insufficient funds: requested $${requested}, available $${available}`,
      400,
    );
    this.available = available;
    this.requested = requested;
  }
}

class InvalidTransactionError extends AppError {
  constructor(message = "Transaction amount must be a positive, finite number") {
    super(message, 400);
  }
}

export {
  AccountAlreadyExistsError,
  AppError,
  BadRequestError,
  InsufficientFundsError,
  InvalidTransactionError,
  NotFoundError,
};

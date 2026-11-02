import CustomTypeError from "../errors/custom.js";

const validateName = (name) => {
  if (typeof name !== "string") {
    throw new CustomTypeError(
      `Expected string for 'name' field but got ${typeof name}`,
      400,
    );
  }
};

const validateAge = (age) => {
  if (typeof age !== "number") {
    throw new CustomTypeError(
      `Expected number for 'age' field but got ${typeof age}`,
      400,
    );
  }
};

const validateEmail = (email) => {
  if (typeof email !== "string") {
    throw new CustomTypeError(
      `Expected string for 'email' field but got ${typeof email}`,
      400,
    );
  }
};

const validateDate = (date) => {
  if (typeof date !== "object") {
    throw new CustomTypeError(
      `Expected object for 'date' field but got ${typeof date}`,
      400,
    );
  }
};

const validateAmount = (amount) => {
  if (typeof amount !== "number") {
    throw new CustomTypeError(
      `Expected number for 'amount' field but got ${typeof amount}`,
      400,
    );
  }
};

export {
  validateName,
  validateAge,
  validateEmail,
  validateDate,
  validateAmount,
};

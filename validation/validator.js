import { BadRequestError } from "../errors/custom.js";

const validateName = (name) => {
  if (typeof name !== "string") {
    throw new BadRequestError(
      `Expected string for 'name' field but got ${typeof name}`,
    );
  }
};

const validateAge = (age) => {
  if (typeof age !== "number") {
    throw new BadRequestError(
      `Expected number for 'age' field but got ${typeof age}`,
    );
  }
  age = parseInt(age);
};

const validateEmail = (email) => {
  if (typeof email !== "string") {
    throw new BadRequestError(
      `Expected string for 'email' field but got ${typeof email}`,
    );
  }
  email = email.toLowerCase();
};

const validateDate = (date) => {
  if (typeof date !== "object") {
    throw new BadRequestError(
      `Expected object for 'date' field but got ${typeof date}`,
    );
  }
};

const validateAmount = (amount) => {
  if (typeof amount !== "number") {
    throw new BadRequestError(
      `Expected number for 'amount' field but got ${typeof amount}`,
    );
  }
  amount = parseFloat(amount);
};

export {
  validateName,
  validateAge,
  validateEmail,
  validateDate,
  validateAmount,
};

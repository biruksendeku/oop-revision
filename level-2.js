import {
  validateName,
  validateAge,
  validateEmail,
  validateDate,
} from "./validation/validator.js";
import {
  AccountAlreadyExistsError,
  BadRequestError,
  InsufficientFundsError,
  InvalidTransactionError,
  NotFoundError,
} from "./errors/custom.js";

const validateTransactionAmount = (amount) => {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new InvalidTransactionError();
  }
};

class Account {
  #balance = 0; // per instance
  static #users = [];
  constructor(name, email, age, date) {
    // validation
    validateName(name);
    validateAge(age);
    validateEmail(email);
    validateDate(date);

    const normalizedEmail = email.toLowerCase();
    if (Account.#users.some((user) => user.email === normalizedEmail)) {
      throw new AccountAlreadyExistsError("Account with this email");
    }

    this.name = name;
    this.age = age;
    this.email = normalizedEmail;
    this.date = date;
    Account.#users.push(this);
  }

  // instance method, called on a specific account
  deposit(amount) {
    validateTransactionAmount(amount);
    this.#balance += amount;
  }

  withdraw(amount) {
    validateTransactionAmount(amount);
    if (amount > this.#balance) {
      throw new InsufficientFundsError(this.#balance, amount);
    }
    this.#balance -= amount;
    return this.#balance;
  }

  transferTo(recipient, amount) {
    validateTransactionAmount(amount);
    if (!(recipient instanceof Account)) {
      throw new BadRequestError("Recipient must be a valid bank account");
    }
    if (recipient === this) {
      throw new BadRequestError("Cannot transfer funds to the same account");
    }
    if (amount > this.#balance) {
      throw new InsufficientFundsError(this.#balance, amount);
    }

    this.#balance -= amount;
    recipient.#balance += amount;
    return {
      senderBalance: this.#balance,
      recipientBalance: recipient.#balance,
    };
  }

  //   createAccountSync() {}
  //   createAccountAsync() {}

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      age: this.age,
      date: this.date,
      balance: this.#balance,
    };
  }

  static getAllUsers() {
    return Account.#users;
  }

  static findByEmail(email) {
    if (typeof email !== "string") {
      throw new BadRequestError(
        `Expected string for 'email' field but got ${typeof email}`,
      );
    }
    const user = Account.#users.find((u) => u.email === email.toLowerCase());
    if (!user) throw new NotFoundError("User");
    return user;
  }

  static findByEmailAndDeposit(email, amount) {
    if (typeof email !== "string") {
      throw new BadRequestError(
        `Expected string for 'email' field but got ${typeof email}`,
      );
    }
    const user = Account.#users.find((u) => u.email === email.toLowerCase());
    if (!user) throw new NotFoundError("User");
    user.deposit(amount);
  }

  static findByEmailAndWithdraw(email, amount) {
    const user = Account.findByEmail(email);
    return user.withdraw(amount);
  }

  static transferFunds(fromEmail, toEmail, amount) {
    const sender = Account.findByEmail(fromEmail);
    const recipient = Account.findByEmail(toEmail);
    return sender.transferTo(recipient, amount);
  }

  getAccountBalance() {
    return this.#balance;
  }
}

new Account("David", "david@rexus.com", 22, new Date());
new Account("John", "john@rexus.com", 20, new Date());
new Account("Bura", "bura@rexus.com", 23, new Date());
new Account("Tensu", "tensu@rexus.com", 19, new Date());

const users = Account.getAllUsers();
console.log("USERS 1: ", users);

Account.findByEmailAndDeposit("john@rexus.com", 1000);

Account.findByEmailAndWithdraw("john@rexus.com", 250);
console.log(
  "John's balance after withdrawal:",
  Account.findByEmail("john@rexus.com").getAccountBalance(),
);

const transferResult = Account.transferFunds(
  "john@rexus.com",
  "david@rexus.com",
  200,
);
console.log("Transfer successful:", transferResult);

const user = Account.findByEmail("david@rexus.com");
console.log(user.getAccountBalance());
console.log(JSON.stringify(user));

const usersLatter = Account.getAllUsers();
console.log("USERS 2: ", usersLatter);

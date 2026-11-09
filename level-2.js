import {
  validateName,
  validateAge,
  validateEmail,
  validateDate,
  validateAmount,
} from "./validation/validator.js";
import { BadRequestError, NotFoundError } from "./errors/custom.js";

class Account {
  #balance = 0; // per instance
  static #users = [];
  constructor(name, email, age, date) {
    // validation
    validateName(name);
    validateAge(age);
    validateEmail(email);
    validateDate(date);

    this.name = name;
    this.age = age;
    this.email = email;
    this.date = date;
    Account.#users.push(this);
  }

  // instance method, called on a specific account
  deposit(amount) {
    validateAmount(amount);
    this.#balance += amount;
  }

  withdraw(amount) {
    validateAmount(amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestError(
        "Withdrawal amount must be a positive, finite number",
      );
    }
    if (amount > this.#balance) {
      throw new BadRequestError("Insufficient funds");
    }
    this.#balance -= amount;
    return this.#balance;
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
    const user = Account.#users.find((u) => u.email === email.toLowerCase());
    if (!user) throw new NotFoundError("User");
    return user;
  }

  static findByEmailAndDeposit(email, amount) {
    const user = Account.#users.find((u) => u.email === email.toLowerCase());
    if (!user) throw new NotFoundError("User");
    user.deposit(amount);
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

const accountForWithdrawal = Account.findByEmail("john@rexus.com");
const remainingBalance = accountForWithdrawal.withdraw(250);
console.log(`Withdrawal successful. Remaining balance: $${remainingBalance}`);

const user = Account.findByEmail("david@rexus.com");
console.log(user.getAccountBalance());
console.log(JSON.stringify(user));

const usersLatter = Account.getAllUsers();
console.log("USERS 2: ", usersLatter);

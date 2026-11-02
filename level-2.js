import {
  validateName,
  validateAge,
  validateEmail,
  validateDate,
  validateAmount,
} from "./validation/validator.js";
import { NotFoundError } from "./errors/custom.js";

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
    return Account.#users.map((user) => user.toJSON()) ?? null;
  }

  static findByEmail(email) {
    const user = Account.#users.find((u) => u.email === email.toLowerCase());
    return user ? user.toJSON() : null;
  }

  static findByEmailAndDeposit(email, amount) {
    const user = Account.#users.find((u) => u.email === email.toLowerCase());
    if (!user) throw new NotFoundError("User");
    user.deposit(amount);
  }
}

new Account("David", "david@rexus.com", 22, new Date());
new Account("John", "john@rexus.com", 20, new Date());
new Account("Bura", "bura@rexus.com", 23, new Date());
new Account("Tensu", "tensu@rexus.com", 19, new Date());

const users = Account.getAllUsers();
console.log("USERS 1: ", users);

Account.findByEmailAndDeposit("john@rexus.com", 1000);

// const user = Account.findByEmail("david@rexus.com");
// console.log(user);

const usersLatter = Account.getAllUsers();
console.log("USERS 2: ", usersLatter);

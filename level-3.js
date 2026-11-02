import { BadRequestError, NotFoundError } from "./errors/custom.js";

class BankAccount {
  #balance = 0;
  static #users = [];
  constructor(name, email, nationality) {
    this.name = name;
    this.email = email;
    this.nationality = nationality;
    BankAccount.#users.push(this);
  }

  deposit(amount) {
    if (typeof amount !== "number") {
      throw new BadRequestError(
        `Invalid amount type: expected number but got ${typeof amount}`,
      );
    }
    return (this.#balance += amount);
  }

  checkBalance() {
    return `${this.name}: your account balance is $${this.#balance}`;
  }

  static getAllUsers() {
    return this.#users;
  }

  static getUserByEmail(email) {
    if (typeof email !== "string") {
      throw new BadRequestError(
        `Invalid email type: expected string but got ${typeof email}`,
      );
    }
    const user = BankAccount.#users.find(
      (u) => u.email === email.toLowerCase(),
    );
    if (!user) {
      throw new NotFoundError("User");
    }
  }
}

new BankAccount("David", "david@rexus.com", "ET");
new BankAccount("DevYay", "devyay@rexus.com", "ET");
new BankAccount("Kura", "kura@rexus.com", "ET");
new BankAccount("John", "john@rexus.com", "ET");
new BankAccount("Tensu", "tensu@rexus.com", "ET");

console.log(BankAccount.getAllUsers());

const user = BankAccount.getUserByEmail("david@rexus.com");
user.deposit(100);
console.log(user.checkBalance());

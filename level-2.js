import {
  validateName,
  validateAge,
  validateEmail,
  validateDate,
  validateAmount,
} from "./validation/validator.js";

class Account {
  static #balance = 0;
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

  static #deposit(amount) {
    validateAmount(amount);
    Account.#balance += amount;
  }

  //   createAccountSync() {}
  //   createAccountAsync() {}

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      age: this.age,
      date: this.date,
    };
  }

  static getAllUsers() {
    return Account.#users.map((user) => user.toJSON());
  }
}

new Account("David", "david@rexus.com", 22, new Date());
new Account("John", "john@rexus.com", 20, new Date());

setTimeout(() => {
  new Account("Bura", "bura@rexus.com", 23, new Date());
  console.log("forgotten code 1");
}, 2000);

setTimeout(() => {
  new Account("Tensu", "tensu@rexus.com", 19, new Date());
  console.log("forgotten code 1");
}, 3000);

const users = Account.getAllUsers();
console.log("USERS: ", users);

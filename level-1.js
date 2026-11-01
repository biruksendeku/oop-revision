import CustomTypeError from "./errors/custom.js";

class User {
  static #users = [];
  constructor(name, age, email) {
    if (typeof name !== "string") {
      throw new CustomTypeError(
        `Expected string for 'name' field but got ${typeof name}`,
        400,
      );
    }
    if (typeof age !== "number") {
      throw new CustomTypeError(
        `Expected number for 'age' field but got ${typeof age}`,
        400,
      );
    }
    if (typeof email !== "string") {
      throw new CustomTypeError(
        `Expected string for 'email' field but got ${typeof email}`,
        400,
      );
    }

    email = email.toLowerCase();
    age = parseInt(age);

    this.name = name;
    this.age = age;
    this.email = email;
    User.#users.push(this);
  }

  toJSON() {
    return { name: this.name, age: this.age, email: this.email };
  }

  login() {
    console.log(`${this.email} has logged in, bye bye ${this.name}`);
  }
  logout() {
    console.log(`${this.email} has logged out, bye bye ${this.name}`);
  }

  static findByEmail(email) {
    if (typeof email !== "string") {
      throw new CustomTypeError(
        `Expected string for 'email' field but got ${typeof email}`,
        400,
      );
    }
    return User.#users.find(
    (u) => u.email === email.toLowerCase()
  ) ?? null;
  }

  static getAllUsers() {
    return this.#users.map((user) => user.toJSON());
  }
}

const newUser = new User("David", 22, "david@rexus.com");
const newUser2 = new User("John", 25, "john@rexus.com");
// console.log(newUser);
// newUser.login();
// newUser.logout();
console.log(User.getAllUsers());
const user = User.findByEmail("david@rexus.com");
console.log(user);

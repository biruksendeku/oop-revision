import CustomTypeError from "./errors/custom.js";

class User {
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
  }
}

const newUser = new User("David", "twenty-one", "david@rexus.com");
console.log(newUser);

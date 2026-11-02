class BankAccount {
  #balance = 0;
  static #users = [];
  constructor(name, email, nationality) {
    this.name = name;
    this.email = email;
    this.nationality = nationality;
    BankAccount.#users.push(this);
  }

  #deposit(amount) {
    return (this.#balance += amount);
  }

  checkBalance() {
    return `Your account balance is $${this.#balance}`;
  }

  static getAllUsers() {
    return this.#users;
  }

  getUserByEmail(email) {
    return BankAccount.#users.find((u) => u.email === email.toLowerCase());
  }
}

new BankAccount("David", "david@rexus.com", "ET");
new BankAccount("DevYay", "devyay@rexus.com", "ET");
new BankAccount("Kura", "kura@rexus.com", "ET");
new BankAccount("John", "john@rexus.com", "ET");
new BankAccount("Tensu", "tensu@rexus.com", "ET");

console.log(BankAccount.getAllUsers());

const user = BankAccount.getUserByEmail("david@rexus.com");
console.log(user.checkBalance());

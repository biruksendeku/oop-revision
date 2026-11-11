import {
  AccountAlreadyExistsError,
  BadRequestError,
  InsufficientFundsError,
  InvalidTransactionError,
  NotFoundError,
} from "./errors/custom.js";
import { pathToFileURL } from "node:url";
import format from "./utils/string/format.js";

const toCents = (amount) => {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new InvalidTransactionError(
      "Amount must be a positive number with no more than two decimal places",
    );
  }
  const cents = Math.round(amount * 100);
  if (!Number.isSafeInteger(cents) || cents / 100 !== amount) {
    throw new InvalidTransactionError(
      "Amount must be a positive number with no more than two decimal places",
    );
  }
  return cents;
};

const validateEmail = (email) => {
  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    throw new BadRequestError("A valid email address is required");
  }
  return format(email);
};

export class BankAccount {
  static #accounts = new Map();

  #name;
  #email;
  #age;
  #openedAt;
  #balanceCents = 0;
  #transactions = [];
  #closedAt = null;

  constructor(name, email, age, openedAt = new Date()) {
    name = format(name);
    email = format(email);
    if (typeof name !== "string" || name.length === 0) {
      throw new BadRequestError("Account name must be a non-empty string");
    }
    if (!Number.isSafeInteger(age) || age <= 0) {
      throw new BadRequestError(
        "Account holder age must be a positive integer",
      );
    }
    if (!(openedAt instanceof Date) || Number.isNaN(openedAt.getTime())) {
      throw new BadRequestError("Account opening date must be a valid Date");
    }

    const normalizedEmail = validateEmail(email);
    if (BankAccount.#accounts.has(normalizedEmail)) {
      throw new AccountAlreadyExistsError("Account with this email");
    }

    this.#name = format(name);
    this.#email = normalizedEmail;
    this.#age = age;
    this.#openedAt = new Date(openedAt.getTime());
    BankAccount.#accounts.set(this.#email, this);
  }

  #assertOpen() {
    if (this.#closedAt) {
      throw new BadRequestError("This account is closed");
    }
  }

  #recordTransaction(type, amountCents, relatedAccount = null) {
    this.#transactions.push({
      type,
      amount: amountCents / 100,
      balance: this.#balanceCents / 100,
      relatedAccount,
      timestamp: new Date().toISOString(),
    });
  }

  deposit(amount) {
    this.#assertOpen();
    const cents = toCents(amount);
    this.#balanceCents += cents;
    if (!Number.isSafeInteger(this.#balanceCents)) {
      this.#balanceCents -= cents;
      throw new InvalidTransactionError(
        "Deposit exceeds the supported balance",
      );
    }
    this.#recordTransaction("deposit", cents);
    return this.#balanceCents / 100;
  }

  withdraw(amount) {
    this.#assertOpen();
    const cents = toCents(amount);
    if (cents > this.#balanceCents) {
      throw new InsufficientFundsError(this.#balanceCents / 100, cents / 100);
    }
    this.#balanceCents -= cents;
    this.#recordTransaction("withdrawal", cents);
    return this.#balanceCents / 100;
  }

  transferTo(recipient, amount) {
    this.#assertOpen();
    const cents = toCents(amount);
    if (!(recipient instanceof BankAccount)) {
      throw new BadRequestError("Recipient must be a bank account");
    }
    recipient.#assertOpen();
    if (
      recipient === this ||
      BankAccount.#accounts.get(recipient.#email) !== recipient
    ) {
      throw new BadRequestError("Recipient must be a different active account");
    }
    if (cents > this.#balanceCents) {
      throw new InsufficientFundsError(this.#balanceCents / 100, cents / 100);
    }
    if (!Number.isSafeInteger(recipient.#balanceCents + cents)) {
      throw new InvalidTransactionError(
        "Transfer exceeds the supported balance",
      );
    }

    this.#balanceCents -= cents;
    recipient.#balanceCents += cents;
    this.#recordTransaction("transfer-out", cents, recipient.#email);
    recipient.#recordTransaction("transfer-in", cents, this.#email);
    return {
      senderBalance: this.#balanceCents / 100,
      recipientBalance: recipient.#balanceCents / 100,
    };
  }

  getTransactions() {
    return this.#transactions.map((transaction) => ({ ...transaction }));
  }

  toJSON() {
    return {
      name: this.#name,
      email: this.#email,
      age: this.#age,
      openedAt: new Date(this.#openedAt.getTime()),
      balance: this.#balanceCents / 100,
      closedAt: this.#closedAt,
    };
  }

  static findByEmail(email) {
    const account = BankAccount.#accounts.get(validateEmail(email));
    if (!account) {
      throw new NotFoundError("Account");
    }
    return account;
  }

  static getAllAccounts() {
    return [...BankAccount.#accounts.values()].map((account) =>
      account.toJSON(),
    );
  }

  static closeByEmail(email) {
    const account = BankAccount.findByEmail(email);
    account.#assertOpen();
    if (account.#balanceCents !== 0) {
      throw new BadRequestError(
        "An account must have a zero balance before closing",
      );
    }

    account.#closedAt = new Date().toISOString();
    BankAccount.#accounts.delete(account.#email);
    return account.toJSON();
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const alice = new BankAccount("Alice", "alice@example.com", 28);
  new BankAccount("Bob", "bob@example.com", 35);

  alice.deposit(1000);
  alice.withdraw(150);
  const transfer = alice.transferTo(
    BankAccount.findByEmail("bob@example.com"),
    200,
  );

  console.log("TRANSFER:", transfer);
  console.log("ACCOUNTS:", BankAccount.getAllAccounts());
  console.log("ALICE TRANSACTIONS:", alice.getTransactions());
}

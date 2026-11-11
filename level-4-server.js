import express from "express";
import { fileURLToPath } from "node:url";
import { BankAccount } from "./level-4.js";

const app = express();
const port = process.env.PORT || 3000;

const alice = new BankAccount("Alice", "alice@example.com", 28);
const bob = new BankAccount("Bob", "bob@example.com", 35);
alice.deposit(1250);
bob.deposit(480);

app.use(express.json());

app.get("/", (_request, response) => {
  response.sendFile(
    fileURLToPath(new URL("./public/level-4.html", import.meta.url)),
  );
});

app.get("/api/accounts", (_request, response) => {
  response.json(BankAccount.getAllAccounts());
});

app.get("/api/accounts/:email/transactions", (request, response) => {
  const account = BankAccount.findByEmail(request.params.email);
  response.json(account.getTransactions());
});

app.post("/api/transactions", (request, response) => {
  if (
    !request.body ||
    typeof request.body !== "object" ||
    Array.isArray(request.body)
  ) {
    response.status(400).json({ error: "A transaction is required" });
    return;
  }

  const { type, email, amount, toEmail } = request.body;
  const account = BankAccount.findByEmail(email);

  if (type === "deposit") {
    account.deposit(amount);
  } else if (type === "withdrawal") {
    account.withdraw(amount);
  } else if (type === "transfer") {
    account.transferTo(BankAccount.findByEmail(toEmail), amount);
  } else {
    response.status(400).json({ error: "Choose a valid transaction type" });
    return;
  }

  response.json({
    accounts: BankAccount.getAllAccounts(),
    transactions: account.getTransactions(),
  });
});

app.use(express.static(fileURLToPath(new URL("./public", import.meta.url))));

app.use((error, _request, response, _next) => {
  const status = error.statusCode || error.status || 500;
  if (status >= 500) {
    console.error(error);
  }
  response.status(status).json({
    error:
      status >= 500
        ? "Something went wrong. Please try again."
        : error.message,
  });
});

app.listen(port, () => {
  console.log(`Level 4 bank demo is running at http://localhost:${port}`);
});

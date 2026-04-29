const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let customers = [];
let nextId = 1;

// POST /customers – Add a new customer
app.post("/customers", (req, res) => {
  const { name, email, phone } = req.body;

  // Basic validation
  if (!name || !email || !phone) {
    return res
      .status(400)
      .json({ error: "Name, email, and phone are required." });
  }

  // Duplicate check by email
  const exists = customers.find(
    (c) => c.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    return res
      .status(409)
      .json({ error: "A customer with this email already exists." });
  }

  const newCustomer = {
    id: nextId++,
    name,
    email,
    phone,
  };

  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

// GET /customers – Get all customers
app.get("/customers", (req, res) => {
  res.json(customers);
});

// DELETE /customers/:id – Delete a customer
app.delete("/customers/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = customers.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Customer not found." });
  }

  const deleted = customers.splice(index, 1)[0];
  res.json({ message: "Customer deleted successfully.", customer: deleted });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

# Customer Management Dashboard

A simple full-stack web application to add, view, and delete customers.

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Storage**: In-memory array (no database)

## How to Run

### 1. Start the Backend

```bash
cd backend
npm run dev
```

The API server will start on **http://localhost:5000**.

### 2. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm run dev
```

The React app will start on **http://localhost:5173**.

## API Endpoints

| Method | Endpoint | Description |
| ------ | ---------------- | -------------------- |
| POST | `/customers` | Add a new customer |
| GET | `/customers` | Get all customers |
| DELETE | `/customers/:id` | Delete a customer |

### POST `/customers` — Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210"
}
```

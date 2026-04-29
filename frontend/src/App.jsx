import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/customers";

function App() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "", key: 0 });

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Auto-clear messages
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage((prev) => ({ ...prev, text: "" })), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setMessage((prev) => ({ text: "Please fill in all fields.", type: "error", key: prev.key + 1 }));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", email: "", phone: "" });
        setMessage((prev) => ({ text: "Customer added successfully!", type: "success", key: prev.key + 1 }));
        fetchCustomers();
      } else {
        const errData = await res.json();
        setMessage((prev) => ({ text: errData.error || "Failed to add customer.", type: "error", key: prev.key + 1 }));
      }
    } catch (err) {
      setMessage((prev) => ({ text: "Network error. Is the server running?", type: "error", key: prev.key + 1 }));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage((prev) => ({ text: "Customer deleted successfully!", type: "success", key: prev.key + 1 }));
        fetchCustomers();
      }
    } catch (err) {
      setMessage((prev) => ({ text: "Failed to delete customer.", type: "error", key: prev.key + 1 }));
    }
  };

  return (
    <div className="app">
      {/* Decorative background shapes */}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      <div className="bg-shape bg-shape-3"></div>

      <header className="header">
        <div className="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h1>Customer Management</h1>
        <p className="header-sub">Add, view, and manage your customers</p>
      </header>

      {/* Snackbar notification */}
      {message.text && (
        <div key={message.key} className={`snackbar snackbar-${message.type}`}>
          <span className="snackbar-icon">
            {message.type === "success" ? "✓" : "✕"}
          </span>
          {message.text}
        </div>
      )}

      <main className="main">
        {/* Add Customer Form */}
        <section className="card form-card">
          <h2 className="card-title">
            <span className="card-title-icon">+</span>
            Add New Customer
          </h2>
          <form onSubmit={handleSubmit} className="form" id="add-customer-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. john@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              id="submit-button"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <span>+</span> Add Customer
                </>
              )}
            </button>
          </form>
        </section>

        {/* Customers Table */}
        <section className="card table-card">
          <h2 className="card-title">
            <span className="card-title-icon">☰</span>
            Customer List
            <span className="badge">{customers.length}</span>
          </h2>

          {customers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p>No customers yet.</p>
              <p className="empty-sub">Add your first customer using the form above.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table id="customers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, index) => (
                    <tr key={c.id} style={{ animationDelay: `${index * 0.05}s` }}>
                      <td>
                        <div className="customer-name">
                          <span className="avatar">
                            {c.name.charAt(0).toUpperCase()}
                          </span>
                          {c.name}
                        </div>
                      </td>
                      <td>{c.email}</td>
                      <td>{c.phone}</td>
                      <td>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(c.id)}
                          id={`delete-btn-${c.id}`}
                          title="Delete customer"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

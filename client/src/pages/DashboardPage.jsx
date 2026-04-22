import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createExpense, fetchExpenses } from "../utils/api";

const defaultExpense = {
  title: "",
  amount: "",
  category: "Food",
  date: ""
};

function DashboardPage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [expenseForm, setExpenseForm] = useState(defaultExpense);
  const [filterCategory, setFilterCategory] = useState("All");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadExpenses = async () => {
    try {
      const data = await fetchExpenses(token);
      setExpenses(data);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadExpenses();
  }, [token, navigate]);

  const handleChange = (event) => {
    setExpenseForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const handleAddExpense = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await createExpense(
        {
          ...expenseForm,
          amount: Number(expenseForm.amount)
        },
        token
      );
      setExpenseForm(defaultExpense);
      setMessage("Expense added successfully");
      await loadExpenses();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const categories = useMemo(() => {
    const uniqueCategories = new Set(expenses.map((expense) => expense.category));
    return ["All", ...uniqueCategories];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    if (filterCategory === "All") {
      return expenses;
    }

    return expenses.filter((expense) => expense.category === filterCategory);
  }, [expenses, filterCategory]);

  const totalAmount = useMemo(
    () => filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0),
    [filteredExpenses]
  );

  return (
    <div className="dashboard-shell">
      <div className="dashboard-header">
        <div>
          <h1>Expense Dashboard</h1>
          <p>{user.name ? `Hello, ${user.name}` : "Track your daily expenses"}</p>
        </div>
        <button className="secondary-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        <form className="card" onSubmit={handleAddExpense}>
          <h2>Add Expense</h2>
          <input name="title" placeholder="Title" value={expenseForm.title} onChange={handleChange} required />
          <input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={expenseForm.amount}
            onChange={handleChange}
            required
          />
          <select name="category" value={expenseForm.category} onChange={handleChange}>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
          <input name="date" type="date" value={expenseForm.date} onChange={handleChange} required />
          {message ? <div className="success">{message}</div> : null}
          {error ? <div className="error">{error}</div> : null}
          <button type="submit">Add Expense</button>
        </form>

        <div className="card">
          <div className="list-header">
            <div>
              <h2>Your Expenses</h2>
              <p>Total: Rs. {totalAmount.toFixed(2)}</p>
            </div>
            <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="expense-list">
            {filteredExpenses.length === 0 ? (
              <p className="empty-state">No expenses found.</p>
            ) : (
              filteredExpenses.map((expense) => (
                <div className="expense-item" key={expense._id}>
                  <div>
                    <h3>{expense.title}</h3>
                    <span>
                      {expense.category} | {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>
                  <strong>Rs. {Number(expense.amount).toFixed(2)}</strong>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

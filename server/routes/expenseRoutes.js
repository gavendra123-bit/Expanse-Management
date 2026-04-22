import express from "express";
import Expense from "../models/Expense.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: "All expense fields are required" });
    }

    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      category,
      date
    });

    return res.status(201).json({
      message: "Expense added successfully",
      expense
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not add expense", error: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1, createdAt: -1 });
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch expenses", error: error.message });
  }
});

export default router;

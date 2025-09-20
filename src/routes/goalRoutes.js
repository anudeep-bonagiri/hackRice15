import express from "express";
import Goal from "../models/Goal.js";

const router = express.Router();

// Create goal
router.post("/", async (req, res) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user goals
router.get("/:userId", async (req, res) => {
  const goals = await Goal.find({ userId: req.params.userId });
  res.json(goals);
});

export default router;
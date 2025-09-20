import express from "express";
import Goal from "../models/Goal.js";
import { checkJwt, getUser } from "../middleware/auth.js";

const router = express.Router();

// Create goal
router.post("/", async (req, res) => {
  try {
    const goal = new Goal({
      ...req.body,
      userId: req.user.id, // Use authenticated user's ID
    });
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user goals (authenticated user only)
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
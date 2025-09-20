import express from "express";
import Goal from "../models/Goal.js";

const router = express.Router();

// Create goal
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    
    const goal = new Goal(req.body);
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user goals by userId
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    
    const goals = await Goal.find({ userId });
    res.json(goals);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";
import goalRoutes from "./routes/goalRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import Goal from "./models/Goal.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

// Test function disabled to prevent server crashes during development
// You can enable this later once Auth0 is fully configured
/*
const createTestGoal = async () => {
  try {
    const existingGoal = await Goal.findOne({ title: "Test Goal - Save $500" });
    if (existingGoal) {
      console.log("✅ Test goal already exists in database");
      return;
    }

    const testGoal = new Goal({
      userId: "auth0|test123",
      title: "Test Goal - Save $500",
      targetAmount: 500,
      currentAmount: 0,
      deadline: new Date("2025-12-31"),
    });

    await testGoal.save();
    console.log("✅ Test goal created successfully!", testGoal);
  } catch (error) {
    console.log("❌ Error creating test goal:", error.message);
  }
};
setTimeout(createTestGoal, 1000);
*/

// Public routes (no auth required)
app.get("/", (req, res) => {
  res.json({ 
    message: "GrowFi API is running!", 
    endpoints: {
      goals: "/api/goals",
      health: "/health"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Protected routes (Auth0 required)
app.use("/api/goals", goalRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

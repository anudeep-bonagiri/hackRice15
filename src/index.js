import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import goalRoutes from "./routes/goalRoutes.js";
import Goal from "./models/Goal.js";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

connectDB();

// Test function to create a sample goal (for database verification)
const createTestGoal = async () => {
  try {
    // Check if test goal already exists
    const existingGoal = await Goal.findOne({ title: "Test Goal - Save $500" });
    if (existingGoal) {
      console.log("✅ Test goal already exists in database");
      return;
    }

    const testGoal = new Goal({
      userId: "12345", // Test user ID
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

// Create test goal after DB connection
setTimeout(createTestGoal, 1000);

app.use("/api/goals", goalRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
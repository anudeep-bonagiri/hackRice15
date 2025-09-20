import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
  
  // User progress and metrics - initialized to 0 for new users
  totalPoints: { type: Number, default: 0 },
  completedModules: { type: Number, default: 0 },
  currentLevel: { type: Number, default: 1 },
  creditScore: { type: Number, default: 0 },
  achievements: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  
  // Module progress tracking
  moduleProgress: {
    type: Map,
    of: Number,
    default: new Map([
      [1, 0], // Budget Boss
      [2, 0], // Debt Destroyer
      [3, 0], // Emergency Fund Fortress
      [4, 0], // Investment Explorer
      [5, 0], // Credit Champion
      [6, 0]  // Wealth Builder Pro
    ])
  },
  
  // User preferences and settings
  preferences: {
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' }
  }
});

export default mongoose.model("User", userSchema);
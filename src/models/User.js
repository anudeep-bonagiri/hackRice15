import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
  // XP and progression system
  xp: { type: Number, default: 0, min: 0 },
  streak: { type: Number, default: 0, min: 0 },
  lastActiveDate: { type: String, default: () => new Date().toISOString() },
  currentStage: { 
    type: String, 
    enum: ['Tadpole', 'Froglet', 'Young Frog', 'Wise Frog'],
    default: 'Tadpole'
  },
  // Learning progress
  completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  moduleProgress: { type: Map, of: Number, default: {} }, // moduleId -> progress percentage
  // Achievements and badges
  achievements: [{ type: String }],
  badges: [{ type: String }]
});

export default mongoose.model("User", userSchema);
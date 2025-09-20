import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User ID
  lessonId: String,
  completed: { type: Boolean, default: false },
  score: Number,
  completedAt: Date
});

export default mongoose.model("Progress", progressSchema);
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Auth0 user ID (string format)
  lessonId: String,
  completed: { type: Boolean, default: false },
  score: Number,
  completedAt: Date
});

export default mongoose.model("Progress", progressSchema);
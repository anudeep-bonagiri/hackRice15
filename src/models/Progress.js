import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessonId: String,
  completed: { type: Boolean, default: false },
  score: Number,
  completedAt: Date
});

export default mongoose.model("Progress", progressSchema);
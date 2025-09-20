import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User ID
  title: String,
  targetAmount: Number,
  currentAmount: { type: Number, default: 0 },
  deadline: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Goal", goalSchema);
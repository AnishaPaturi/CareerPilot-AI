import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  topic: String,

  role: String,

  score: Number,

  accuracy: Number,

  confidence: Number,

  communication: Number,

  pointsEarned: Number,

  transcript: [
    {
      speaker: String,
      text: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Interview", interviewSchema);
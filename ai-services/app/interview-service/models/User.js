import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name: String,

  email: {
    type: String,
    unique: true
  },

  password: String,

  points: {
    type: Number,
    default: 0
  },

  currentBadge: {
    type: String,
    default: "seed"
  },

  totalInterviews: {
    type: Number,
    default: 0
  },

  avatarUrl: String

});

export default mongoose.model("User", userSchema);
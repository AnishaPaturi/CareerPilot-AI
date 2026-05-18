import mongoose from "mongoose";

const practiceSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  topic: String,

  questions: [String],

  answers: [String],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("PracticeSession", practiceSchema);
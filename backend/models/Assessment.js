import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
 

  userId: {
  type: String,
  required: true,
},
  messages: [
    {
      role: String,
      content: String,
    },
  ],

  risk: String,

  condition: String,

  specialist: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model(
  "Assessment",
  assessmentSchema
);
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: String,
  specialist: String,
  rating: Number,
  distance: String,
  experience: String,
  hospital: String,
  fee: String,
});

export default mongoose.model(
  "Doctor",
  doctorSchema
);
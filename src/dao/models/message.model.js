import mongoose from "mongoose";

export default mongoose.model(
  "messages",
  mongoose.Schema({
    user: { type: String, required: true },
    message: String,
  })
);

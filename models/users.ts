import mongoose from "mongoose";

export const messagesSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  name : {
    type: String,
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});
const users = mongoose.model("users", messagesSchema);
export default users;

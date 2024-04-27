import mongoose from "mongoose";
export const messagesSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});
const messages = mongoose.model("messages", messagesSchema);
export default messages;

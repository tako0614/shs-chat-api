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
  textColor: {
    type: String,
    required: true,
  },
  timeColor: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    required: true,
  },
  nameColor: {
    type: String,
    required: true,
  },
});
const messages = mongoose.model("messages", messagesSchema);
export default messages;

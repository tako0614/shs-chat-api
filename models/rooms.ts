import mongoose from "mongoose";

export const messagesSchema = new mongoose.Schema({
  rooms: {
    type: String,
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});
const rooms = mongoose.model("rooms", messagesSchema);
export default rooms;

import mongoose from "mongoose";

const ai = new mongoose.Schema({
  userText: {
    type: String,
    enum: ["text", "file", "video", "image"],
    default: "text",
  },

  aiReply: {
    type: String,
    enum: ["text", "file", "video", "image"],
    default: "text",
  },
});
export default mongoose.model("ai", ai);
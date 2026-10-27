import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    userInput: {
      type: String,
      required: true,
    },
    aiData: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Chat History",
    },
    chats: {
      type: [chatSchema],
      required: true,
    },
  },
  { timestamps: true },
);
export default mongoose.model("AI", sessionSchema);

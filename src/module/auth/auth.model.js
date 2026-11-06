import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
name: {
    type: String,
    required: [true, "Name is required"],
    lowercase: true,
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  role: {
    type: String,
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    select: false,
  },
},{
  timestamps:true
});

export default mongoose.model("AiUser", userSchema);

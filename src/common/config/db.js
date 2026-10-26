import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb is conected on : ${conn.connection.host}`);
  } catch (error) {
    console.error(`database is not connected ${error.message}`);
  }
};
export default connectDB;

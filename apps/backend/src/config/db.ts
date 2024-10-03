import mongoose from "mongoose";
import validateEnv from "./index";

const connectDB = async () => {
  try {
    const env = validateEnv();
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from "mongoose";
import { config } from "./index";

export const mongo = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

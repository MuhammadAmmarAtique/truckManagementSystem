import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const uri = String(process.env.MONGODB_URI);

export const connectDB = async () => {
  try {
    const res = await mongoose.connect(uri);

    const dbName = res.connection.name;

    console.log(`Connected to MongoDB ${dbName} database with Mongoose!`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

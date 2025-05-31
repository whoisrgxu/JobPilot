import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  const conn = await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB:", conn.connection.name);
};

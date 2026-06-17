import mongoose from "mongoose";

export async function connectDb(uri) {
  if (!uri) throw new Error("MONGODB_URI is not set");

  mongoose.connection.on("connected", () => console.log("mongo connected"));
  mongoose.connection.on("error", (err) => console.error("mongo error:", err.message));
  mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));

  await mongoose.connect(uri);
  return mongoose.connection;
}

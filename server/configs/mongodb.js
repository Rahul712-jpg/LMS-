import mongoose from "mongoose";

export default async function connectDB() {
  console.log(process.env.MONGODB_URI);
  const conn = await mongoose.connect(process.env.MONGODB_URI)||'fail';
  console.log("✅ CONNECTED DB:", conn.connection.name);

}

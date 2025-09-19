import mongoose from "mongoose"; 
import { DB_NAME } from "../constants.js";

const connectDB = async (mongoUrl) => {
  try {
   const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: DB_NAME,
    });
    console.log("MongoDB connected successfully", connectionInstance.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

// Ensure MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in the .env file");
  process.exit(1); // Exit the application
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the app if DB connection fails
  }
};

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: ["http://localhost:5173"], // Vite's default port
  credentials: true 
}));

// Import routes
import authRouter from "./routes/auth.route.js";
import noteRouter from "./routes/note.route.js";

// Use routes
app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

// Test endpoint to verify database connection
app.get("/test", async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection("notes").findOne();

    if (!result) {
      return res.status(404).json({ message: "No documents found in 'notes' collection" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error connecting to the database", error });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

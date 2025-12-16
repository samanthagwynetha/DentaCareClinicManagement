import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import connectDB from "./src/config/db.js"; // Commented out for now

dotenv.config();

const app = express();

// connectDB(); // Commented out - will enable when MongoDB is ready


// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Dental Clinic Backend is running 🦷");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

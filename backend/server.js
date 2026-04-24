import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import patientRoutes from "./src/routes/patientRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import invoiceRoutes from "./src/routes/invoiceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import connectDB from "./src/config/db.js";
import authRoutes from "./routes/authRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";

dotenv.config();

const app = express();

connectDB();


// Security Middlewares
app.use(helmet()); // Sets various HTTP headers for security

// Rate Limiting (Prevent Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", limiter); // Apply rate limiter to all API routes

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Patient Routes
app.use("/api/patients", patientRoutes);

// Appointment Routes
app.use("/api/appointments", appointmentRoutes);

// Invoice Routes
app.use("/api/invoices", invoiceRoutes);

// User Routes
app.use("/api/users", userRoutes);

// Admin Routes
app.use("/api", adminRoutes);

//Auth Routes
app.use("/api/auth", authRoutes);

// Account Routes (current user profile/settings)
app.use("/api/account", accountRoutes);

//Dashboard Routes
app.use("/api/dashboard", dashboardRoutes);

// Reminder Routes
app.use("/api/reminders", reminderRoutes);

// Settings Routes
app.use("/api/settings", settingsRoutes);

// Notifications Routes
app.use("/api/notifications", notificationRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Dental Clinic Backend is running 🦷");
});

// Error Handling Middlewares (Must be at the end)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

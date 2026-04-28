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
import mongoose from "mongoose";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();

// Track server start time for uptime calculation
const startTime = Date.now();

connectDB();


// CORS Configuration (Must be first to handle preflight requests properly)
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Security Middlewares
app.use(helmet()); // Sets various HTTP headers for security

// Rate Limiting
// General API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Increased limit for normal usage
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", apiLimiter);

// Strict limit for authentication routes to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Strict limit for logins
  message: "Too many login attempts, please try again after 15 minutes"
});
app.use("/api/auth/", authLimiter);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Logging Middleware - logs all API requests
app.use((req, res, next) => {
  const start = Date.now();

  // Log when response is finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path}`, {
      module: "http",
      method: req.method,
      path: req.path,
      status: res.statusCode,
      responseTime: `${duration}ms`
    });
  });

  next();
});

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

// Health Check Endpoint (for monitoring & load balancers)
// NOT rate-limited because monitoring services check this frequently
app.get("/health", (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000); // in seconds
  const isDatabaseConnected = mongoose.connection.readyState === 1; // 1 = connected
  const statusCode = isDatabaseConnected ? 200 : 503; // 503 = Service Unavailable

  res.status(statusCode).json({
    status: isDatabaseConnected ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: uptime, // seconds since server started
    database: isDatabaseConnected ? "connected" : "disconnected",
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0"
  });
});

// Error Handling Middlewares (Must be at the end)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`, {
    module: "server",
    port: PORT,
    environment: process.env.NODE_ENV || "development"
  });
});

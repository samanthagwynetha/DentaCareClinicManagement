import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import patientRoutes from "./src/routes/patientRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import invoiceRoutes from "./src/routes/invoiceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import connectDB from "./src/config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

connectDB();


// Middleware
app.use(cors());
app.use(express.json());

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

//Dashboard Routes
app.use("/api/dashboard", dashboardRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Dental Clinic Backend is running 🦷");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

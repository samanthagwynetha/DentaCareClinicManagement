import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import patientRoutes from "./src/routes/patientRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import invoiceRoutes from "./src/routes/invoiceRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import connectDB from "./src/config/db.js";

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

// Test route
app.get("/", (req, res) => {
  res.send("Dental Clinic Backend is running 🦷");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

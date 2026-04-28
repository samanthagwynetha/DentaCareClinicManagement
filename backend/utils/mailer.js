import nodemailer from "nodemailer";

// Lazily create the transporter so env vars are available after dotenv loads
export function createTransporter() {
  // Use generic SMTP details (like Gmail) if provided, otherwise fallback to Resend
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.resend.com",
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || "resend",
      pass: process.env.SMTP_PASS || process.env.RESEND_API_KEY,
    },
  });
}

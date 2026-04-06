import nodemailer from "nodemailer";

// Lazily create the transporter so env vars are available after dotenv loads
export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.RESEND_SMTP_HOST || "smtp.resend.com",
    port: 465,
    secure: true,
    auth: {
      user: "resend",
      pass: process.env.RESEND_API_KEY,
    },
  });
}

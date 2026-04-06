import { createTransporter } from "../utils/mailer.js";

export const sendReminder = async (req, res) => {
  const { patientName, patientEmail, dentist, date, time } = req.body;

  // Validate required fields
  if (!patientEmail) {
    return res.status(400).json({ message: "Patient email is required to send a reminder." });
  }
  if (!patientName || !dentist || !date || !time) {
    return res.status(400).json({ message: "Missing appointment details." });
  }

  // Format the date nicely
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 40px; }
        .card { background: #fff; border-radius: 12px; padding: 32px; max-width: 520px; margin: 0 auto; border: 1px solid #e5e7eb; }
        .brand { color: #0d9488; font-size: 22px; font-weight: bold; margin-bottom: 4px; }
        .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 28px; }
        .greeting { font-size: 16px; color: #111827; margin-bottom: 16px; }
        .detail { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 14px; color: #374151; }
        .label { color: #6b7280; min-width: 70px; }
        .value { font-weight: 600; color: #111827; }
        .note { margin-top: 24px; padding: 12px 16px; background: #f0fdfa; border-left: 4px solid #14b8a6; border-radius: 6px; font-size: 13px; color: #0f766e; }
        .footer { margin-top: 28px; font-size: 12px; color: #9ca3af; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="brand">DentaCare</div>
        <div class="subtitle">Appointment Reminder</div>

        <p class="greeting">Hi <strong>${patientName}</strong>,</p>
        <p style="color:#374151;font-size:14px;margin-bottom:20px;">
          This is a friendly reminder about your upcoming dental appointment.
        </p>

        <div class="detail">
          <span class="label">📅 Date</span>
          <span class="value">${formattedDate}</span>
        </div>
        <div class="detail">
          <span class="label">🕐 Time</span>
          <span class="value">${time}</span>
        </div>
        <div class="detail">
          <span class="label">🦷 Dentist</span>
          <span class="value">${dentist}</span>
        </div>

        <div class="note">
          Please arrive at least <strong>10 minutes early</strong>. If you need to reschedule, please contact us as soon as possible.
        </div>

        <div class="footer">— The DentaCare Team</div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"DentaCare" <${process.env.RESEND_FROM || "onboarding@resend.dev"}>`,
      to: patientEmail,
      subject: `Appointment Reminder — ${formattedDate} at ${time}`,
      html: htmlBody,
    });

    return res.status(200).json({ message: "Reminder email sent successfully." });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ message: "Failed to send reminder email.", error: err.message });
  }
};

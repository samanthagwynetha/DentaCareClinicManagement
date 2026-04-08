import mongoose from "mongoose";

const clinicSettingsSchema = new mongoose.Schema(
  {
    clinicName: { type: String, default: "DentaCare Dental Clinic" },
    logoBase64: { type: String, default: "" },
    phone: { type: String, default: "+63 912 345 6789" },
    email: { type: String, default: "info@dentacare.com" },
    address: { type: String, default: "123 Smile Ave, Manila" },
    openingTime: { type: String, default: "08:00 AM" },
    closingTime: { type: String, default: "05:00 PM" },
  },
  { timestamps: true }
);

export default mongoose.model("ClinicSettings", clinicSettingsSchema);

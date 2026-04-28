import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Patient", 
            required: true
        },

        dentist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true
        },

        date: {
            type: Date, 
            required: true
        },
        
        time: {
            type: String, 
            required: true
        },

        status: {
            type: String,
            enum: ["Scheduled", "Completed", "Cancelled"],
            default: "Scheduled"
        },

        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

// Add indexes for dashboard performance
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ patient: 1 });

export default mongoose.model("Appointment", appointmentSchema);
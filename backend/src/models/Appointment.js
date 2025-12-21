import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Patient", 
            required: true
        },

        dentist: {
            type: String, 
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

export default mongoose.model("Appointment", appointmentSchema);
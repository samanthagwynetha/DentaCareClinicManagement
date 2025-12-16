const mongoose = require("mongoose");
const { type } = require("os");

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Patient", 
            required: true
        },
        date: {type: Date, required: true},
        time: {type: String, required: true},
        service: {type: String, required: true},
        status: {
            type: String,
            enum: ["Scheduled", "Completed", "Cancelled"],
            default: "Scheduled"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
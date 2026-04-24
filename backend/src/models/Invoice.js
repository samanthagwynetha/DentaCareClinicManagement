import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
        },
        issuedByUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, 
        services: [
            {
                name: String,
                price: Number,
            },
        ],
        totalAmount: {
            type: Number,
            required:true,
        },
        status: {
            type: String,
            enum: ["unpaid", "paid"],
            default: "unpaid",
        }, 
        paymentMethod: {
            type: String,
            enum: ["cash", "gcash", "card"]
        },
        issuedDate: {
            type: Date,
            default: Date.now,
        },
        dueDate: {
            type: Date,
        },
    },
    { timestamps: true } 
);

export default mongoose.model("Invoice", invoiceSchema);
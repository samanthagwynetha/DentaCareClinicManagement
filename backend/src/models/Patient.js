import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
    {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gender: {type: String, required: true},
    birthDate: {type: String},
    phone: {type: String},
    email: {type: String},
    address: {type: String},
    },

    {timestamps: true}
);

export default mongoose.model("Patient", patientSchema);
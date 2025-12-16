const mangoose = require("mongoose");

const patientSchema =new mangoose.Schema(
    {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gender: {type: String, required: true},
    birthDate: {type: String},
    phone: {type: Sting},
    email: {type: String},
    adress: {type: String},
    },

    {timestamps: true}
);

module.exports = mangoose.model("Patient", patientSchema);
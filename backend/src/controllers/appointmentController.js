import Appointment from "../models/Appointment.js";

//create appointment
export const createAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create(req.body);
        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
};

//read all
export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("patient")
            .populate("dentist", "name");
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

//read one
export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate("patient")
            .populate("dentist", "name");
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.json(appointment);
    }  catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update
export const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate (
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
};

//delete
export const deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: "Appointment deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
        },

        emailNotifications: {
            type: Boolean,
            default: true,
        },

        smsReminders: {
            type: Boolean,
            default: true,
        },

        appointmentAlerts: {
            type: Boolean,
            default: true,
        },

        billingAlerts: {
            type: Boolean,
            default: false,
        },

        systemUpdates: {
            type: Boolean,
            default: false,
        },

        language: {
            type: String,
            default: 'English',
        },

        dateFormat: {
            type: String,
            default: 'MM/DD/YYYY',
        },

        currency: {
            type: String,
            default: 'PHP',
        },

        theme: {
            type: String,
            default: 'Light',
        },

        role: {
            type: String,
            enum: ['admin', 'dentist', 'receptionist'],
            default: 'receptionist',
        },

        avatarBase64: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//compare password method 
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
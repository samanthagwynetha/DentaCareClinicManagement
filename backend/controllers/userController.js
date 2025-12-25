import User from '../models/User.js';

// create user
export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(400).json({ message: error.message});
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

// Delete all users (for testing only)
export const deleteAllUsers = async (req, res) => {
    try {
        await User.deleteMany({});
        res.json({ message: "All users deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};
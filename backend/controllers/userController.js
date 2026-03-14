import User from '../models/User.js';

// Get all dentists (accessible to all authenticated users)
export const getDentists = async (req, res) => {
    try {
        const dentists = await User.find({ role: 'dentist' }).select('_id name');
        res.json(dentists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        const updated = await user.save();
        res.json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (String(req.user?._id) === String(req.params.id)) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetUserPassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = password;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        console.log('Login attempt:', { email, password });

        const user = await User.findOne({ email});
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log('Stored password hash:', user.password);
        console.log('Entered password:', password);
        
        const isMatch = await user.matchPassword(password);
        console.log('Password match:', isMatch);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
 };
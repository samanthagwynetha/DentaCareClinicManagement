import jwt from 'jsonwebtoken';

const generateToken = (id, role, remember) => {
    const expiresIn = remember ? '30d' : '1d';
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn } 
    );
};

export default generateToken;

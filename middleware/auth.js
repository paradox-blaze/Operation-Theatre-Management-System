import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY = process.env.SESSION_SECRET; // In production, use environment variable

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.user_id, role: user.role, username: user.username },
        SECRET_KEY,
        { expiresIn: '24h' }
    );
};

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    };
};
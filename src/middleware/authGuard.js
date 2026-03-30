import jwt from 'jsonwebtoken';
import { findUserById } from '../db.js';
import { getEnvironmentData } from 'node:worker_threads';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('There is no environment variable JWT_SECRET');

export function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

export async function authGuard(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log('authHeader', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No authorization token' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('decoded', decoded);
        const user = await findUserById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'No such user' });
        }
        req.user = user;
        next();
    } catch {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

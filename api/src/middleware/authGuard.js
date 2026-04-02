import jwt from 'jsonwebtoken';
import { findUserById } from '../db.js';
import { getEnvironmentData } from 'node:worker_threads';
import { decode } from 'node:punycode';

const JWT_SECRET = process.env.API_JWT_SECRET;
if (!JWT_SECRET) throw new Error('There is no environment variable JWT_SECRET');

export function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '21d' });
}

export function decodeUserId(token) {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
}

export async function authGuard(req, res, next) {
    console.log('went into authGuard');
    const token = req.cookies?.token;
    console.log('cookie token present:', !!token);
    if (!token) {
        return res.status(401).json({ error: 'No authorization token' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('decoded', decoded);
        console.log('before findUserById');
        const user = await findUserById(decoded.userId);
        console.log('after findUserById, user = ', user);
        if (!user) {
            return res.status(401).json({ error: 'No such user' });
        }
        req.user = user;
        next();
    } catch (err) {
        console.log('error catched', err.name, err.message);
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

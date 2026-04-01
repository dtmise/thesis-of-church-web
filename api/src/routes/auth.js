import { Router } from 'express';
import bcrypt from 'bcryptjs';
import {
    createUser, findUserByEmail, findTeamById, getTeamMembers
} from '../db.js';
import { generateToken, authGuard } from '../middleware/authGuard.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { fullName, group, email, password } = req.body;

    if (!fullName || !group || !email || !password) {
        return res.status(400).json({ error: 'Заполните все поля' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Пароль минимум 6 символов' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
        return res.status(409).json({ error: 'Email уже занят' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ fullName, group, email, passwordHash });
    const token = generateToken(user.id);

    res.status(201).json({
        token,
        user: { id: user.id, fullName, email, group, teamId: null, role: null },
        message: 'Регистрация успешна'
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = generateToken(user.id);
    res.json({
        token,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            group: user.group,
            teamId: user.teamId,
            role: user.role
        }
    });
});

router.get('/me', authGuard, async (req, res) => {
    const user = req.user;
    let team = null;
    if (user.teamId) {
        const t = await findTeamById(user.teamId);
        if (t) {
            const members = (await getTeamMembers(user.teamId)).map(m => ({
                id: m.id,
                fullName: m.fullName,
                group: m.group,
                email: m.email,
                role: m.role
            }));
            team = { id: t.id, name: t.name, score: t.score, members };
            if (user.role === 'captain') {
                team.invite_code = t.invite_code;
            }
        }
    }
    res.json({
        id: user.id,
        fullName: user.fullName,
        group: user.group,
        email: user.email,
        role: user.role,
        team
    });
});

export default router;

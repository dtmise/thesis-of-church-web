import { Router } from 'express';
import bcrypt from 'bcryptjs';
import {
    createTeam, createUser, findUserByEmail,
    findTeamByName, findTeamById
} from '../db.js';
import { generateToken, authGuard } from '../middleware/authGuard.js';

const router = Router();

router.post('/register-team', async (req, res) => {
    const { teamName, members } = req.body;

    if (!teamName || !members || !Array.isArray(members)) {
        return res.status(400).json({ error: 'Неверный формат запроса' });
    }

    if (members.length < 1 || members.length > 3) {
        return res.status(400).json({ error: 'Команда: от 1 до 3 участников' });
    }

    if (findTeamByName(teamName)) {
        return res.status(409).json({ error: 'Название команды уже занято' });
    }

    for (const m of members) {
        if (findUserByEmail(m.email)) {
            return res.status(409).json({ error: `Email ${m.email} уже занят` });
        }
    }

    const team = createTeam(teamName);
    const users = [];

    for (let i = 0; i < members.length; i++) {
        const m = members[i];
        const passwordHash = await bcrypt.hash(m.password, 10);
        const user = createUser({
            fullName: m.fullName,
            group: m.group,
            email: m.email,
            passwordHash,
            teamId: team.id,
            role: i === 0 ? 'captain' : 'member'
        });
        users.push({ id: user.id, fullName: user.fullName, email: user.email });
    }

    res.status(201).json({
        message: 'Команда успешно зарегистрирована',
        team: { id: team.id, name: team.name },
        users
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = findUserByEmail(email);
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

router.get('/me', authGuard, (req, res) => {
    const user = req.user;
    const team = findTeamById(user.teamId);
    res.json({
        id: user.id,
        fullName: user.fullName,
        group: user.group,
        email: user.email,
        role: user.role,
        team: team ? { id: team.id, name: team.name } : null
    });
});

export default router;

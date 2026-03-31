import { Router } from 'express';
import bcrypt from 'bcryptjs';
import {
    createTeam, createUser, findUserByEmail,
    findTeamByName, findTeamById
} from '../db.js';
import { generateToken, authGuard } from '../middleware/authGuard.js';

const router = Router();

router.post('/register-team', async (req, res) => {
    console.log('inside register-team');
    const { teamName, members } = req.body;

    if (!teamName || !members || !Array.isArray(members)) {
        return res.status(400).json({ error: 'Неверный формат запроса' });
    }

    if (members.length < 1 || members.length > 3) {
        return res.status(400).json({ error: 'Команда: от 1 до 3 участников' });
    }
    
    const foundTeam = await findTeamByName(teamName);
    if (foundTeam) {
        return res.status(409).json({ error: 'Название команды уже занято' });
    }

    for (const m of members) {
        const user = await findUserByEmail(m.email);
        if (user) {
            return res.status(409).json({ error: `Email ${m.email} уже занят` });
        }
    }

    const team = await createTeam(teamName);
    const users = [];

    for (let i = 0; i < members.length; i++) {
        const m = members[i];
        const passwordHash = await bcrypt.hash(m.password, 10);
        const user = await createUser({
            fullName: m.fullName,
            group: m.group,
            email: m.email,
            passwordHash,
            teamId: team.id,
            role: i === 0 ? 'captain' : 'member'
        });
        users.push({ id: user.id, fullName: user.fullName, email: user.email });
    }
    const captain = users[0],
          token   = generateToken(captain.id);

    res.status(201).json({
        team,
        users,
        token,
        user: captain,
        message: 'Команда успешно зарегистрирована'
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
    const team = await findTeamById(user.teamId);
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

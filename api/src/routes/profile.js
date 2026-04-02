import { Router } from 'express';
import bcrypt from 'bcryptjs';
import {
    findTeamById, getTeamMembers, updateUser,
    updateTeamName, updateUserEmail, updateUserPassword,
    findUserByEmail, findTeamByName, findUserById
} from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
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

router.put('/', async (req, res) => {
    const { fullName: newFullName, group: newGroup } = req.body;
    const updated = await updateUser(req.user.id, { newFullName, newGroup });

    if (!updated) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
        id: updated.id,
        fullName: updated.fullName,
        email: updated.email,
        group: updated.group
    });
});

// Смена email
router.put('/email', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Укажите новый email' });
    }

    const existing = await findUserByEmail(email);
    if (existing && existing.id !== req.user.id) {
        return res.status(409).json({ error: 'Этот email уже занят' });
    }

    const updated = await updateUserEmail(req.user.id, email);
    if (!updated) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ message: 'Email обновлён', email: updated.email });
});

// Смена пароля
router.put('/password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Укажите старый и новый пароль' });
    }
    if (newPassword.length < 4) {
        return res.status(400).json({ error: 'Пароль должен быть не менее 4 символов' });
    }

    const user = await findUserById(req.user.id);
    const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!valid) {
        return res.status(403).json({ error: 'Неверный текущий пароль' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(req.user.id, newHash);

    res.json({ message: 'Пароль обновлён' });
});

// Смена названия команды (только капитан)
router.put('/team-name', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Укажите новое название команды' });
    }

    if (req.user.role !== 'captain') {
        return res.status(403).json({ error: 'Только капитан может менять название команды' });
    }

    const existing = await findTeamByName(name);
    if (existing && existing.id !== req.user.teamId) {
        return res.status(409).json({ error: 'Название команды уже занято' });
    }

    const updated = await updateTeamName(req.user.teamId, name);
    if (!updated) {
        return res.status(404).json({ error: 'Команда не найдена' });
    }

    res.json({ message: 'Название команды обновлено', team: updated });
});

export default router;

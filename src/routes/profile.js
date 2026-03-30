import { Router } from 'express';
import { findTeamById, getTeamMembers, updateUser } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
    const user = req.user;
    const team = findTeamById(user.teamId);
    const members = (await getTeamMembers(user.teamId)).map(m => ({
        id: m.id,
        fullName: m.fullName,
        group: m.group,
        email: m.email
    }));

    res.json({
        id: user.id,
        fullName: user.fullName,
        group: user.group,
        email: user.email,
        role: user.role,
        team: team ? { id: team.id, name: team.name, members } : null
    });
});

router.put('/', async (req, res) => {
    const { fullName, group } = req.body;
    const updated = await updateUser(req.user.id, { fullName, group });
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

export default router;

import { Router } from 'express';
import { findTeamById, getTeamMembers, updateUser } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
    const user = req.user;
    console.log('before findTeamById, user:', user);
    const team = await findTeamById(user.teamId);
    console.log('before getTeamMembers, team:', team);
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

export default router;

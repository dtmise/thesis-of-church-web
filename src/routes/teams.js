import { Router } from 'express';
import { getAllTeams, findTeamById, getTeamMembers } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
    const teams = await getAllTeams();
    res.json(teams);
});

router.get('/:id', async (req, res) => {
    const teamId = parseInt(req.params.id, 10);
    const team = await findTeamById(teamId);
    if (!team) {
        return res.status(404).json({ error: 'Команда не найдена' });
    }

    const members = await getTeamMembers(teamId).map(m => ({
        id: m.id,
        fullName: m.fullName,
        group: m.group,
        email: m.email
    }));

    res.json({ id: team.id, name: team.name, members });
});

export default router;

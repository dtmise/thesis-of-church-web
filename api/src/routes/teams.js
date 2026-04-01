import { Router } from 'express';
import crypto from 'crypto';
import {
    getAllTeams, findTeamById, getTeamMembers,
    findTeamByName, createTeam, findTeamByInviteCode, setUserTeam
} from '../db.js';
import { clearSensInfo } from './users.js';

const router = Router();

router.get('/', async (req, res) => {
    const teams = await getAllTeams();
    const result = [];
    for (const t of teams) { 
        const users = await getTeamMembers(t.id);
        const usersWoutSensInfo = users.map(clearSensInfo);
        const { invite_code, ...teamSafe } = t;
        result.push({ 
            ...teamSafe, 
            membersCount: usersWoutSensInfo.length,
            members: usersWoutSensInfo
        });
    };
    res.json(result);
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name || name.length < 3) {
        return res.status(400).json({ error: 'Название команды — минимум 3 символа' });
    }

    if (req.user.teamId) {
        return res.status(400).json({ error: 'Вы уже состоите в команде' });
    }

    const existing = await findTeamByName(name);
    if (existing) {
        return res.status(409).json({ error: 'Название команды уже занято' });
    }

    const inviteCode = crypto.randomUUID();
    const team = await createTeam(name, inviteCode);
    await setUserTeam(req.user.id, team.id, 'captain');

    res.status(201).json({
        team: { id: team.id, name: team.name, score: team.score, invite_code: team.invite_code },
        message: 'Команда создана'
    });
});

router.post('/join', async (req, res) => {
    const { inviteCode } = req.body;
    if (!inviteCode) {
        return res.status(400).json({ error: 'Укажите код приглашения' });
    }

    if (req.user.teamId) {
        return res.status(400).json({ error: 'Вы уже состоите в команде' });
    }

    const team = await findTeamByInviteCode(inviteCode);
    if (!team) {
        return res.status(404).json({ error: 'Неверный код приглашения' });
    }

    const members = await getTeamMembers(team.id);
    if (members.length >= 3) {
        return res.status(400).json({ error: 'Команда заполнена (максимум 3 участника)' });
    }

    await setUserTeam(req.user.id, team.id, 'member');

    res.json({
        team: { id: team.id, name: team.name, score: team.score },
        message: 'Вы присоединились к команде'
    });
});

router.get('/:id', async (req, res) => {
    const teamId = parseInt(req.params.id, 10);
    const team = await findTeamById(teamId);
    if (!team) {
        return res.status(404).json({ error: 'Команда не найдена' });
    }

    const members = await getTeamMembers(teamId);
    const membersWoutSensInfo = members.map(clearSensInfo);

    res.json({ 
        ...team, 
        membersCount: membersWoutSensInfo.length, 
        members: membersWoutSensInfo 
    });
});

export default router;

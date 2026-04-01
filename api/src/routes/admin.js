import { Router } from 'express';
import {
    getAllUsers, getAllTeamsWithMembers, getAllNews,
    createNews, updateNews, deleteNews, setAdmin, getAllContacts
} from '../db.js';

const router = Router();

// Admin guard middleware
router.use((req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ error: 'Доступ запрещён' });
    }
    next();
});

// Users
router.get('/users', async (req, res) => {
    const users = await getAllUsers();
    res.json(users);
});

router.patch('/users/:id/admin', async (req, res) => {
    const userId = parseInt(req.params.id);
    if (userId === req.user.id) {
        return res.status(400).json({ error: 'Нельзя изменить свой статус админа' });
    }
    const { isAdmin } = req.body;
    if (typeof isAdmin !== 'boolean') {
        return res.status(400).json({ error: 'Укажите isAdmin (true/false)' });
    }
    const result = await setAdmin(userId, isAdmin);
    if (!result) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json(result);
});

// Contacts
router.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.json(contacts);
});

// Teams with members
router.get('/teams', async (req, res) => {
    const teams = await getAllTeamsWithMembers();
    res.json(teams);
});

// News CRUD
router.get('/news', async (req, res) => {
    const news = await getAllNews();
    res.json(news);
});

router.post('/news', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Укажите заголовок и содержание' });
    }
    const news = await createNews(title, content);
    res.status(201).json(news);
});

router.put('/news/:id', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Укажите заголовок и содержание' });
    }
    const news = await updateNews(req.params.id, title, content);
    if (!news) return res.status(404).json({ error: 'Новость не найдена' });
    res.json(news);
});

router.delete('/news/:id', async (req, res) => {
    const result = await deleteNews(req.params.id);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Новость не найдена' });
    res.json({ message: 'Новость удалена' });
});

export default router;

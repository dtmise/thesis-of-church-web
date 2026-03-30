import { Router } from 'express';
import { getAllNews, findNewsById } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
    res.json(await getAllNews());
});

router.get('/:id', async (req, res) => {
    const newsId = parseInt(req.params.id, 10);
    const news = await findNewsById(newsId);
    if (!news) {
        return res.status(404).json({ error: 'Новость не найдена' });
    }
    res.json(news);
});

export default router;

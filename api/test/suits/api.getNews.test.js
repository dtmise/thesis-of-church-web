import getAgent from 'supertest';
import registerTeamAndGetToken from './util/registerTeamAndGetToken';

const port  = process.env.API_PORT;
const agent = await getAgent(`http://localhost:${port}`);

describe('GET /api/news', () => {
    let token;

    beforeAll(async () => {
        const db = globalThis.__DB__;
        await db.none(`INSERT INTO news(title, content, published_at)
            VALUES($1, $2, $3), ($4, $5, $6)`,
            [
                'Старт регистрации', 
                'Регистрация открыта до 10 апреля.', 
                new Date('2026-03-27T09:00:00Z'),
                'Обновление правил',
                'Добавлены требования к командам.',
                new Date('2026-03-28T12:00:00Z')
            ]
        );
        token = await registerTeamAndGetToken(agent);
    });

    it('get list of news', async () => {
        const res = await agent.get('/api/news')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual([
            {
                "id": expect.any(Number),
                "title": "Старт регистрации",
                "content": "Регистрация открыта до 10 апреля.",
                "publishedAt": expect.any(String)
            },
            {
                "id": expect.any(Number),
                "title": "Обновление правил",
                "content": "Добавлены требования к командам.",
                "publishedAt": expect.any(String)
            }
        ]);
    });
});
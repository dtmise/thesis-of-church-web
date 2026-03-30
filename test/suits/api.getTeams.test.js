import getAgent from 'supertest';
import registerTeam from '../utils/registerTeam.js';

const port  = process.env.PORT;
const agent = await getAgent(`http://localhost:${port}`);

describe('GET /api/teams', () => {
    let token;

    beforeAll(async () => {
        const user = await registerTeam(agent);
        const res = await agent
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: user.email, passwordHash: user.passwordHash });

        token = res.body.token;
        console.log('token', token);
    });

    it('get list of teams', async () => {
        const res = await agent.get('/api/teams')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual([
            {
                "id": expect.any(Number),
                "name": "RegisterTeamTest",
                "membersCount": 3
            }
        ]);
    });

    it('returns 401 with no token', async () => {
        await agent
            .get('/api/teams')
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .get('/api/teams')
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });
});
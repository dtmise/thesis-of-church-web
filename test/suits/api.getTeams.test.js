import getAgent from 'supertest';
import registerTeam from './util/registerTeam.js';
import loginUserAndGetToken from './util/logInUserAndGetToken.js';

const port  = process.env.PORT;
const agent = await getAgent(`http://localhost:${port}`);

describe('GET /api/teams', () => {
    let teamName, members, token;

    beforeAll(async () => {
        const teamData = await registerTeam(agent);
        teamName = teamData.teamName;
        members = teamData.members;
        const user = members[0];
        token = await loginUserAndGetToken(agent, user.email, user.password);
    });

    it('get list of teams', async () => {
        const res = await agent.get('/api/teams')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual([
            {
                "id": expect.any(Number),
                "name": teamName,
                "membersCount": members.length
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
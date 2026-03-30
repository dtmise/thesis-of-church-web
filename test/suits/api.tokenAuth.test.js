import getAgent from 'supertest';
import registerTeamAndGetToken from './util/registerTeamAndGetToken';
import registerTeam from './util/registerTeam';
import logInUserAndGetToken from './util/logInUserAndGetToken';

const port  = process.env.PORT;
const agent = await getAgent(`http://localhost:${port}`);
const url   = '/api/auth/me';

describe(`API: GET ${url}`, () => {
    let preparedUser, token;

    beforeAll(async () => {
        const teamData = await registerTeam(agent);
        const teamName = teamData.teamName;
        user = teamData.members[0];
        preparedUser = { 
            ...user, 
            id: expect.any(Number), 
            role: 'captain', 
            team: {
                id: expect.any(Number),
                name: teamName
            }
        };
        delete preparedUser.password;
        token = await logInUserAndGetToken(agent, user.email, user.password);
    });

    it('returns current user with valid token', async () => {
        const res = await agent
            .get(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual(preparedUser);
    });

    it('returns 401 with no token', async () => {
        await agent
            .get(url)
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .get(url)
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });
});
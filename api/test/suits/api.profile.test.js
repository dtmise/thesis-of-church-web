import getAgent from 'supertest';
import registerTeamAndGetUser from './util/registerTeamAndGetUser';
import logInUserAndGetToken from './util/logInUserAndGetToken';

const port  = process.env.API_PORT;
const agent = await getAgent(`http://localhost:${port}`);
const url   = '/api/profile';

describe(`API: GET ${url}`, () => {
    let user, token;

    beforeAll(async () => {
        user = await registerTeamAndGetUser(agent);
        token = await logInUserAndGetToken(agent, user.email, user.password);
    });

    it('get user', async () => {
        const res = await agent.get(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual(expect.objectContaining({
            "id": expect.any(Number),
            "fullName": user.fullName,
            "group": user.group,
            "email": user.email,
            "role": "captain",
            "team": expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                score: expect.any(Number)
            })
        }));
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
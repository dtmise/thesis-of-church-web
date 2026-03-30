import getAgent from 'supertest';
import registerTeam from './util/registerTeam';
import logInUserAndGetToken from './util/logInUserAndGetToken';

const port  = process.env.PORT;
const agent = await getAgent(`http://localhost:${port}`);

describe('GET /api/teams/1', () => {
    let teamName, members, token;

    beforeAll(async () => {
        const teamData = await registerTeam(agent);
        teamName = teamData.teamName;
        members = teamData.members;
        const user = { ...(members[0]) };
        membersWoutPassAndWAnyId = members.map(m => {
            delete m.password;
            return { ...m, id: expect.any(Number) };
        });
        token = await logInUserAndGetToken(agent, user.email, user.password); 
    });

    it('get team', async () => {
        const res = await agent.get('/api/teams/1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual({
            "id": expect.any(Number),
            "name": teamName,
            "members": membersWoutPassAndWAnyId
        });
    });
});
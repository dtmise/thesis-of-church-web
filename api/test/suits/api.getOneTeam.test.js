import getAgent from 'supertest';
import registerTeam from './util/registerTeam';
import logInUserAndGetToken from './util/logInUserAndGetToken';

const port  = process.env.API_PORT;
const agent = await getAgent(`http://localhost:${port}`);

describe('GET /api/teams/1', () => {
    let teamName, members, token, membersWoutPassAndWAnyId;

    beforeAll(async () => {
        const teamData = await registerTeam(agent);
        teamName = teamData.teamName;
        members = teamData.members;
        const user = { ...(members[0]) };
        const membersCopy = JSON.parse(JSON.stringify(members));
        membersWoutPassAndWAnyId = membersCopy.map(m => {
            delete m.password;
            delete m.email;
            return expect.objectContaining({ ...m, id: expect.any(Number) });
        });
        token = await logInUserAndGetToken(agent, user.email, user.password); 
    });

    it('get team', async () => {
        const res = await agent.get('/api/teams/1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual(expect.objectContaining({
            "id": expect.any(Number),
            "name": teamName,
            "membersCount": expect.any(Number),
            "members": membersWoutPassAndWAnyId
        }));
    });
});
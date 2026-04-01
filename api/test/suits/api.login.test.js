import getAgent from 'supertest';

const port  = process.env.API_PORT;
const agent = await getAgent(`http://localhost:${port}`);
const url   = '/api/auth/login';

describe(`API: POST ${url}`, () => {
    let token;

    beforeAll(async () => {
        const res = await agent.post('/api/auth/register-team')
            .set('Content-Type', 'application/json')
            .send({
                teamName: 'LoginTestTeam',
                members: [
                    {
                        fullName: 'Login Test User',
                        password: 'qwerty1234',
                        group: '25215',
                        email: 'loginTestUser@example.com'
                    }
                ] 
            });

        token = res.body.token;
    });

    it('login using email and password', async () => {
        const res = await agent.post(url)
            .set('Content-Type', 'application/json')
            .send({
                "email": "loginTestUser@example.com",
                "password": "qwerty1234"
            })
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual({
            "token": expect.any(String),
            "user": {
                "id": expect.any(Number),
                "fullName": "Login Test User",
                "email": "loginTestUser@example.com",
                "group": "25215",
                "teamId": expect.any(Number),
                "role": "captain"
            }
        });
    });
});

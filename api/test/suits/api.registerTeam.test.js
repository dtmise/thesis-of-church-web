import getAgent from 'supertest';

const port  = process.env.API_PORT;
const agent = await getAgent(`http://localhost:${port}`);
const url   = '/api/auth/register-team';

describe(`API: POST ${url}`, () => {
    it('should successfully registered team', async () => {
        const res = await agent.post(url)
            .set('Content-Type', 'application/json')
            .send({
                "teamName": "RegisterTeamTest",
                "members": [
                    {
                        "fullName": "Иванов Иван Иванович",
                        "group": "25201",
                        "email": "ivan@example.com",
                        "password": "StrongPass123!"
                    },
                    {
                        "fullName": "Петров Петр Петрович",
                        "group": "25202",
                        "email": "petr@example.com",
                        "password": "StrongPass123!"
                    },
                    {
                        "fullName": "Сидоров Сидор Сидорович",
                        "group": "25203",
                        "email": "sidor@example.com",
                        "password": "StrongPass123!"
                    }
                ]
            })
            .expect(201)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual(expect.objectContaining({
            "message": expect.any(String),
            "team": expect.objectContaining({
                "id": expect.any(Number),
                "name": expect.any(String)
            }),
            "users": [
                expect.objectContaining({
                    "id": expect.any(Number),
                    "fullName": expect.any(String),
                    "email": expect.any(String)
                }),
                expect.objectContaining({
                    "id": expect.any(Number),
                    "fullName": expect.any(String),
                    "email": expect.any(String)
                }),
                expect.objectContaining({
                    "id": expect.any(Number),
                    "fullName": expect.any(String),
                    "email": expect.any(String)
                })
            ]
        }));
    });

    it('should fail with wrong json', async () => {
        const res = await agent.post(url)
            .set('Content-Type', 'application/json')
            .send({});

        expect(res.statusCode).toBe(400);
    });

    it('should fail with too many members of the team', async () => {
        const res = await agent.post(url)
            .set('Content-Type', 'application/json')
            .send({
                teamName: "TooManyMembers",
                members: [
                    {
                        fullName: 'Can Be Member1',
                        password: 'qwerty1234',
                        group: '25214',
                        email: "canbemember1@example.com"
                    },
                    {
                        fullName: 'Can Be Member2',
                        password: 'qwerty1234',
                        group: '25214',
                        email: "canbemember2@example.com"
                    },
                    {
                        fullName: 'Can Be Member3',
                        password: 'qwerty1234',
                        group: '25214',
                        email: "canbemember3@example.com"
                    },
                    {
                        fullName: 'Too Many Members',
                        password: 'qwerty1234',
                        group: '25214',
                        email: "toomanymembers@example.com"
                    }
                ]
            });

        expect(res.statusCode).toBe(400);
    });

    it('should fail with already used team name', async () => {
        const res1 = await agent.post(url)
            .set('Content-Type', 'application/json')
            .send({
                teamName: 'AlreadyGottenTeamnameTest',
                members: [
                    {
                        fullName: 'Already Gotten TeamName1',
                        password: 'qwerty1234',
                        group: '25215',
                        email: 'alreadygottenteamname1@example.com'
                    },
                    {
                        fullName: 'Already Gotten TeamName2',
                        password: 'qwerty1234',
                        group: '25215',
                        email: 'alreadygottenteamname2@example.com'
                    },
                    {
                        fullName: 'Already Gotten TeamName3',
                        password: 'qwerty1234',
                        group: '25215',
                        email: 'alreadygottenteamname3@example.com'
                    }
                ]
            })
        
        expect(res1.statusCode).toBe(201);

        const res2 = await agent.post(url)
            .set('Content-Type', 'application/json')
            .send({
                teamName: 'AlreadyGottenTeamnameTest',
                members: [
                    {
                        fullName: 'Already Gotten TeamName1',
                        password: 'qwerty1234',
                        group: '25215',
                        email: 'alreadygottenteamname1@example.com'
                    },
                    {
                        fullName: 'Already Gotten TeamName2',
                        password: 'qwerty1234',
                        group: '25215',
                        email: 'alreadygottenteamname2@example.com'
                    },
                    {
                        fullName: 'Already Gotten TeamName3',
                        password: 'qwerty1234',
                        group: '25215',
                        email: 'alreadygottenteamname3@example.com'
                    }
                ]
            });
        
        expect(res2.statusCode).toBe(409);
    });
});

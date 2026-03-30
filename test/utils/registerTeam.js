export default async function registerTeam(agent) {
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
    
    return res.body.users[0];
}
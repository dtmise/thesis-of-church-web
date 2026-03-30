export default async (agent, email, password) => {
    const res = await agent.post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email, password });

    return res.body.token;
}
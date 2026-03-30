import { faker } from '@faker-js/faker';

export default async function registerTeam(agent) {
    const userGenerator = (function* () {
        while (true) {
            const fullName = faker.person.firstName()
                + ' ' + faker.person.middleName()
                + ' ' + faker.person.lastName();
            yield {
                fullName,
                group: faker.string.numeric(5),
                email: faker.internet.email(),
                password: faker.internet.password()
            };
        }
    })();
    const members = Array.from({ length: 3 }, (_, __) => userGenerator.next().value);
    const teamName = faker.string.alphanumeric();
    const data = { teamName, members };
    await agent.post('/api/auth/register-team')
        .set('Content-Type', 'application/json')
        .send(data);

    return data;
}
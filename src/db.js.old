let teamIdCounter = 0;
let userIdCounter = 0;

const db = {
    teams: [],
    users: [],
    news: [
        {
            id: 1,
            title: "Старт регистрации",
            content: "Регистрация открыта до 10 апреля.",
            publishedAt: "2026-03-27T09:00:00Z"
        },
        {
            id: 2,
            title: "Обновление правил",
            content: "Добавлены требования к командам.",
            publishedAt: "2026-03-28T12:00:00Z"
        }
    ]
};

export function createTeam(name) {
    const team = { id: ++teamIdCounter, name };
    db.teams.push(team);
    return team;
}

export function createUser({ fullName, group, email, passwordHash, teamId, role }) {
    const user = { id: ++userIdCounter, fullName, group, email, passwordHash, teamId, role };
    db.users.push(user);
    return user;
}

export function findUserByEmail(email) {
    return db.users.find(u => u.email === email);
}

export function findUserById(id) {
    return db.users.find(u => u.id === id);
}

export function findTeamById(id) {
    return db.teams.find(t => t.id === id);
}

export function findTeamByName(name) {
    return db.teams.find(t => t.name === name);
}

export function getTeamMembers(teamId) {
    return db.users.filter(u => u.teamId === teamId);
}

export function getAllTeams() {
    return db.teams.map(t => ({
        id: t.id,
        name: t.name,
        membersCount: db.users.filter(u => u.teamId === t.id).length
    }));
}

export function updateUser(id, updates) {
    const user = db.users.find(u => u.id === id);
    if (!user) return null;
    if (updates.fullName !== undefined) user.fullName = updates.fullName;
    if (updates.group !== undefined) user.group = updates.group;
    return user;
}

export function getAllNews() {
    return db.news;
}

export function findNewsById(id) {
    return db.news.find(n => n.id === id);
}

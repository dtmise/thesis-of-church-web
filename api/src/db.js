import dbFactory from './dbFactory.js';

const db = await dbFactory.getDb();

export async function createTeam(teamName, inviteCode = null) {
    return db.one('INSERT INTO teams(name, invite_code) VALUES($1, $2) RETURNING *', [teamName, inviteCode]);
}

export async function createUser({ fullName, group, email, passwordHash, teamId = null, role = null }) {
    const res = await db.one(`INSERT INTO users(name, university_group, email, password_hash, team_id, role) 
        VALUES($<fullName>,$<group>,$<email>,$<passwordHash>,$<teamId>,$<role>) RETURNING id`,
        { fullName, group, email, passwordHash, teamId, role }
    );
    return { id: res.id, fullName, group, email, passwordHash, teamId, role };
}

export async function findUserByEmail(email) {
    return db.oneOrNone(`SELECT 
        id, 
        name AS "fullName",
        university_group AS group, 
        email, 
        password_hash AS "passwordHash",
        team_id AS "teamId",
        role,
        is_admin AS "isAdmin"
        FROM users WHERE email = $1`, [email]);
}

export async function findUserById(id) {
        return db.oneOrNone(`SELECT 
        id, 
        name AS "fullName",
        university_group AS group, 
        email, 
        password_hash AS "passwordHash",
        team_id AS "teamId",
        role,
        is_admin AS "isAdmin"
        FROM users WHERE id = $1`, [id]);
}

export async function findTeamById(id) {
    return db.oneOrNone(`SELECT * FROM teams WHERE id = $1`, [id]);
}

export async function findTeamByName(name) {
    return db.oneOrNone(`SELECT * FROM teams WHERE name = $1`, [name]);
}

export async function getTeamMembers(teamId) {
    return db.any(`SELECT 
        id, 
        name AS "fullName",
        university_group AS group, 
        email, 
        password_hash AS "passwordHash",
        team_id AS "teamId",
        role,
        is_admin AS "isAdmin"
        FROM users WHERE team_id = $1`, teamId);
}

export async function getAllTeams() {
    return db.any('SELECT * FROM teams');
}

export async function updateUser(id, { newFullName, newGroup }) {
    console.log('user.id, newFullName, newGroup', id, newFullName, newGroup);
    const user = await db.oneOrNone(
        `UPDATE users 
        SET name = COALESCE($1, name), 
        university_group = COALESCE($2, university_group) 
        WHERE id = $3 
        RETURNING
        id, 
        name AS "fullName",
        university_group AS group, 
        email, 
        password_hash AS "passwordHash",
        team_id AS "teamId",
        role,
        is_admin AS "isAdmin"`,
        [newFullName, newGroup, id]
    );
    if (!user) {
        return null;
    } else {
        return user;
    }
}

export async function getAllNews() {
    return db.any('SELECT id, title, content, published_at AS "publishedAt" FROM news ORDER BY published_at DESC');
}

export async function findNewsById(id) {
    return db.oneOrNone(`SELECT 
        id, title, content, published_at AS "publishedAt" 
        FROM news 
        WHERE id = $1;`, 
        [id]
    );
}

export async function updateTeamName(teamId, newName) {
    return db.oneOrNone(
        'UPDATE teams SET name = $1 WHERE id = $2 RETURNING *',
        [newName, teamId]
    );
}

export async function updateUserEmail(userId, newEmail) {
    return db.oneOrNone(
        `UPDATE users SET email = $1 WHERE id = $2
        RETURNING id, name AS "fullName", university_group AS group, email, team_id AS "teamId", role`,
        [newEmail, userId]
    );
}

export async function updateUserPassword(userId, newPasswordHash) {
    return db.oneOrNone(
        'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id',
        [newPasswordHash, userId]
    );
}

export async function getAllContacts() {
    return db.any('SELECT id, telegram, vk, created_at AS "createdAt" FROM contacts ORDER BY created_at DESC');
}

export async function saveContact({ telegram, vk }) {
    return db.one(
        'INSERT INTO contacts(telegram, vk) VALUES($1, $2) RETURNING *',
        [telegram || null, vk || null]
    );
}

export async function findTeamByInviteCode(inviteCode) {
    return db.oneOrNone('SELECT * FROM teams WHERE invite_code = $1', [inviteCode]);
}

export async function setUserTeam(userId, teamId, role) {
    return db.oneOrNone(
        `UPDATE users SET team_id = $1, role = $2 WHERE id = $3
        RETURNING id, name AS "fullName", university_group AS group, email, team_id AS "teamId", role`,
        [teamId, role, userId]
    );
}

export async function clearTeamMembers(teamId) {
    return db.none('UPDATE users SET team_id = NULL, role = NULL WHERE team_id = $1', [teamId]);
}

export async function deleteTeam(teamId) {
    return db.none('DELETE FROM teams WHERE id = $1', [teamId]);
}

// Admin functions
export async function getAllUsers() {
    return db.any(`SELECT 
        id, name AS "fullName", university_group AS group, email, 
        team_id AS "teamId", role, is_admin AS "isAdmin"
        FROM users ORDER BY id`);
}

export async function setAdmin(userId, isAdmin) {
    return db.oneOrNone(
        'UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING id, is_admin AS "isAdmin"',
        [isAdmin, userId]
    );
}

export async function getAllTeamsWithMembers() {
    const teams = await db.any('SELECT id, name, invite_code AS "inviteCode", score FROM teams ORDER BY id');
    for (const team of teams) {
        team.members = await db.any(`SELECT 
            id, name AS "fullName", university_group AS group, email, role
            FROM users WHERE team_id = $1 ORDER BY id`, [team.id]);
    }
    return teams;
}

export async function createNews(title, content) {
    return db.one(
        'INSERT INTO news(title, content) VALUES($1, $2) RETURNING id, title, content, published_at AS "publishedAt"',
        [title, content]
    );
}

export async function updateNews(id, title, content) {
    return db.oneOrNone(
        'UPDATE news SET title = $1, content = $2 WHERE id = $3 RETURNING id, title, content, published_at AS "publishedAt"',
        [title, content, id]
    );
}

export async function deleteNews(id) {
    return db.result('DELETE FROM news WHERE id = $1', [id]);
}
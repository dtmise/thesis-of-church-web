import dbFactory from '../test/utils/dbFactory.js';

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
        role
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
        role
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
        role
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
        role`,
        [newFullName, newGroup, id]
    );
    if (!user) {
        return null;
    } else {
        return user;
    }
}

export async function getAllNews() {
    return db.any('SELECT id, title, content, published_at AS "publishedAt" FROM news');
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

export async function saveContact({ email, telegram, vk }) {
    return db.one(
        'INSERT INTO contacts(email, telegram, vk) VALUES($1, $2, $3) RETURNING *',
        [email || null, telegram || null, vk || null]
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
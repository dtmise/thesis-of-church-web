import dbFactory from '../test/utils/dbFactory.js';

const db = await dbFactory.getDb('./createScheme.sql');

export async function createTeam(teamName) {
    return db.one('INSERT INTO teams(name) VALUES($1:name) RETURNING id', [teamName]);
}

export async function createUser({ fullName, group, email, passwordHash, teamId, role }) {
    const id = await db.one(`INSERT INTO users(name, university_group, email, password_hash, team_id, role) 
        VALUES($<fullName>,$<group>,$<email>,$<passwordHash>,$<teamId>,$<role>) RETURNING id`,
        { fullName, group, email, passwordHash, teamId, role }
    )
    return { id, fullName, group, email, passwordHash, teamId, role };
}

export async function findUserByEmail(email) {
    return db.one(`SELECT 
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
        return db.one(`SELECT 
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
    return db.one(`SELECT * FROM teams WHERE id = $1`, [id]);
}

export async function findTeamByName(name) {
    return db.one(`SELECT * FROM teams WHERE name = $1`, [name]);
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
    const user = await db.oneOrNone(
        `UPDATE users 
        SET name = COALESCE($1, name), 
        unviersity_group = COALESCE($2, unviersity_group) 
        WHERE id = $3 
        RETURNING *`,
        [newFullName, newGroup, id]
    );
    if (!user) {
        return null;
    } else {
        return user;
    }
}

export async function getAllNews() {
    return db.any('SELECT * FROM news');
}

export async function findNewsById(id) {
    return db.oneOrNone('SELECT * FROM news WHERE id = $1', [id]);
}
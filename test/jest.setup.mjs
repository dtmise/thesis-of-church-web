import pgp from 'pg-promise';

let db;

beforeAll(async () => {
    // const { default: dbDeleter } = await import('./utils/dbDeleter.mjs');
    // await dbDeleter.deleteDb();
    const dbConfigs = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD
    };
    db = pgp()(dbConfigs);
    const query = new pgp.QueryFile('../../test/utils/createScheme.sql');
    await db.none(query);
});

afterAll(async () => {
    db.$pool.end();
})
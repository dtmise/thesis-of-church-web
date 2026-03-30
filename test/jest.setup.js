import pgp from 'pg-promise';
import { join as joinPath, dirname } from 'path';
import { fileURLToPath } from 'url';

beforeAll(async () => {
     const resolveAbsolute = (relativePath) => {
        const currentFileUrl = import.meta.url;
        const currentFilePath = fileURLToPath(currentFileUrl);
        const currentDirPath = dirname(currentFilePath);
        return joinPath(currentDirPath, relativePath);
    }
    
    // const queryAbsolutePath = resolveAbsolute('./utils/deleteDb.sql');
    const db = globalThis.__DB__;
    // const query = new pgp.QueryFile(queryAbsolutePath);
    await db.none('TRUNCATE TABLE news, users, teams RESTART IDENTITY CASCADE;');
    //await db.none(query);
});

afterAll(async () => {
    // const { default: dbDeleter } = await import('./utils/dbDeleter.mjs');
    // await dbDeleter.deleteDb();
})
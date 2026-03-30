import { join as joinPath, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import pgp from 'pg-promise';

const resolveAbsolute = (relativePath) => {
    const currentFileUrl = import.meta.url;
    const currentFilePath = fileURLToPath(currentFileUrl);
    const currentDirPath = dirname(currentFilePath);
    return joinPath(currentDirPath, relativePath);
}
const envFileAbsolutePath = resolveAbsolute('../sns/test.env');
process.loadEnvFile(envFileAbsolutePath);

const dbFactoryAbsolutePath = resolveAbsolute('./utils/dbFactory.js');
const { default: dbFactory } = await import(pathToFileURL(dbFactoryAbsolutePath));
const initQueryAbsolutePath = resolveAbsolute('./utils/createScheme.sql');
const db = await dbFactory.getDb(initQueryAbsolutePath);

const queryAbsolutePath = resolveAbsolute('./utils/deleteDb.sql');
const query = new pgp.QueryFile(queryAbsolutePath);
await db.none(query);
console.log('this is end');
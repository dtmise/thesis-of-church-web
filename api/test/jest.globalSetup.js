import { join as joinPath, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export default async (globalConfig, projectConfig) => {
    const resolveAbsolute = (relativePath) => {
        const currentFileUrl = import.meta.url;
        const currentFilePath = fileURLToPath(currentFileUrl);
        const currentDirPath = dirname(currentFilePath);
        return joinPath(currentDirPath, relativePath);
    }
    const envFileAbsolutePath = resolveAbsolute('./res/test.env');
    process.loadEnvFile(envFileAbsolutePath);

    const dbFactoryAbsolutePath = resolveAbsolute('./utils/dbFactory.js');
    const { default: dbFactory } = await import(pathToFileURL(dbFactoryAbsolutePath));
    const initQueryAbsolutePath = resolveAbsolute('./utils/createScheme.sql');
    const db = await dbFactory.getDb(initQueryAbsolutePath);
    globalThis.__DB__ = db;
    
    const serverFactoryAbsolutePath = resolveAbsolute('./utils/serverFactory.js');
    const serverFactoryUrl = pathToFileURL(serverFactoryAbsolutePath);
    const { default: serverFactory } = await import(serverFactoryUrl);
    const server = await serverFactory.getServer();
    globalThis.__SERVER__ = server;
}

export default async (globalConfig, projectConfig) => {
    process.loadEnvFile('./sns/test.env');

    const { default: dbFactory } = await import('./utils/dbFactory.js');
    const db = dbFactory.getDb();
    globalThis.__DB__ = db;
    
    const { default: serverFactory } = await import('./utils/serverFactory.js');
    const server = serverFactory.getServer();
    globalThis.__SERVER__ = server;
}

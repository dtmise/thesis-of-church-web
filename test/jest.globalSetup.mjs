export default async (globalConfig, projectConfig) => {
    process.loadEnvFile('./sns/test.env');

    // const { default: dbFactory } = await import('./utils/dbFactory.mjs');
    // const db = dbFactory.getDb();
    // globalThis.__DB__ = db;
    
    // const { default: serverFactory } = await import('./utils/serverFactory.mjs');
    // const server = serverFactory.getServer();
    // globalThis.__SERVER__ = server;

    const { default: app } = await import('../src/app.js');
    const port = process.env.PORT;
    const server = app.listen(port);
    await new Promise(res => server.on('listening', res));
    globalThis.__SERVER__ = server;
}

import dotenv from 'dotenv';
dotenv.config({ path: './dev.env' });

export default async function globalSetup() {
    const { default: app } = await import('./src/app.js');
    const server = app.listen(1904);
    await new Promise((resolve) => server.on('listening', resolve));
    globalThis.__SERVER__ = server;
}

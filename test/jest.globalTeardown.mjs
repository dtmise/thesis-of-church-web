export default async (globalConfig, projectConfig) => {
    if (globalThis.__SERVER__) {
        await new Promise(res => globalThis.__SERVER__.close(res));
    }
    if (globalThis.__DB__) {
        await globalThis.__DB__.$pool.end();
    }
}

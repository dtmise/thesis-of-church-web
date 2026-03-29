beforeAll(async () => {
    const { default: dbDeleter } = await import('./utils/dbDeleter.js');
    await dbDeleter.deleteDb();
});
import {} from '../../src/db.js';

describe('db test', () => {
    let db;
    
    beforeAll(async () => {
        db = globalThis.__DB__;
    })

    it('connects to postgres', async () => {
        const result = await db.one('SELECT 1 AS value');
        expect(result.value).toBe(1);
    });

});

const dbDeleter = new class {
    constructor() {
        this.db = undefined;
        this.deleteQuery = undefined;
    }

    async deleteDb() {
        if (!this.db) {
            const { default: dbFactory } = await import('./dbFactory.js');
            this.db = dbFactory.getDb();
        }
        if (!this.deleteQuery) {
            const { QueryFile } = await import('pg-promise');
            this.deleteQuery = new QueryFile('./deleteDb.sql');
        }
        console.log('this.db', JSON.stringify(this.db));
        return this.db.none(this.deleteQuery);
    }
}();

export default dbDeleter;
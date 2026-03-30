const dbFactory = new class {
    constructor() {
        this.db = undefined;
        this.dbConfigs = {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD
        };
     }

    async getDb(initQueryFile) {
        if (!this.db) {    
            const { default: getPgp } = await import('pg-promise');
            const pgp = getPgp();
            this.db = pgp(this.dbConfigs);
            const initQuery = new pgp.QueryFile(initQueryFile);
            await this.db.none(initQuery);
        }
        return this.db;
    }
}();

export default dbFactory;
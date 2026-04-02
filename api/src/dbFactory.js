const dbFactory = new class {
    constructor() {
        this.db = undefined;
        this.dbConfigs = {
            host: process.env.API_DB_HOST,
            port: process.env.API_DB_PORT,
            user: process.env.API_DB_USER,
            database: process.env.API_DB_NAME,
            password: process.env.API_DB_PASSWORD
        };
    }

    async getDb() {
        if (!this.db) {
            const { default: getPgp } = await import('pg-promise');
            const pgp = getPgp();
            this.db = pgp(this.dbConfigs);
        }

        return this.db;
    }
}();

export default dbFactory;
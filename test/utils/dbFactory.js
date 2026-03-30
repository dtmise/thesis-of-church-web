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

    async getDb() {
        if (!this.db) {    
            const { default: getConnector,
                    QueryFile } = await import('pg-promise');
            this.db = getConnector()(this.dbConfigs);
            const createSchemeQuery = new QueryFile('./createScheme.sql');
            await this.db.none(createSchemeQuery);
        }
        return this.db;
    }
}();

console.log('dbFactory: export: ', dbFactory);
export default dbFactory;
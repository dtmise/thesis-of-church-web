import { join as joinPath, dirname, isAbsolute } from 'path';
import { fileURLToPath } from 'url';

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

    async getDb(initQueryFile) {
        if (!this.db) {    
            const { default: getPgp } = await import('pg-promise');
            const pgp = getPgp();
            this.db = pgp(this.dbConfigs);
         
            if (initQueryFile) {
                let fullPath;
                if (!isAbsolute(initQueryFile)) {
                    const currentFileUrl = import.meta.url;
                    const currentFilePath = fileURLToPath(currentFileUrl);
                    const currentDir = dirname(currentFilePath);
                    fullPath = joinPath(currentDir, initQueryFile);
                } else {
                    fullPath = initQueryFile;
                }
                const initQuery = new pgp.QueryFile(fullPath);
                await this.db.none(initQuery);
            }
        }
        
        return this.db;
    }
}();

export default dbFactory;
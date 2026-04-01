const serverFactory = new class {
    constructor() {
        this.server = undefined;
    }

    async getServer() {
        if (!this.server) {            
            const { default: app } = await import('../../src/app.js');
            const port = process.env.API_PORT;
            this.server = app.listen(port);
            await new Promise(res => this.server.on('listening', res));
        }
        return this.server;
    }
}();

export default serverFactory;

const serverFactory = new class {
    constructor() {
        this.server = undefined;
    }

    getServer() {
        if (!this.server) {
            await (async () => {
                const { default: app } = await import('../src/app.js');
                const port = process.env.PORT;
                this.server = await app.listen(port);
                await new Promise(res => server.on('listening', res));
            })();
        }
        return this.server;
    }
}();

export default serverFactory;

import app from './app.js';

const mode = process.env.NODE_ENV ?? 'test';
let server;

if (mode === 'production') {
    const https   = await import('https');
    const fs      = await import('fs');
    const keyPath = process.env.KEY_PATH;
    const crtPath = process.env.CRT_PATH;
    const options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(crtPath)
    };
    server = https.createServer(options, app);
} else {
    const http = await import('http');
    server = http.createServer(app);
}
const port = process.env.API_PORT ?? 1904;
server.listen(port, () => {
    console.log(`Server in ${mode} mode, running on localhost:${port}`);
});

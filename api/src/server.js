import app from './app.js';

const mode = process.env.NODE_ENV ?? 'development';
const useHttps = process.env.API_USE_HTTPS === 'true';
let server;

if (useHttps) {
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
server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
        console.error(`API port ${port} is already in use. Stop the old process before starting a new one.`);
        process.exit(1);
    }

    throw err;
});

server.listen(port, () => {
    const protocol = useHttps ? 'https' : 'http';
    console.log(`Server in ${mode} mode, running on ${protocol}://localhost:${port}`);
});

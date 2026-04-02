import express from 'express';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import https from 'https';
import http from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';

const apiPort = process.env.API_PORT || 1904;
const apiHost = process.env.API_HOST || 'localhost';
const apiProtocol = process.env.API_USE_HTTPS === 'true' ? 'https' : 'http';
const useHttps = process.env.WEB_USE_HTTPS === 'true';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
app.use(morgan('combined'));

// Проксируем /api на API-сервер (HTTP)
app.use('/api', createProxyMiddleware({
    target: `${apiProtocol}://${apiHost}:${apiPort}`,
    changeOrigin: true,
    secure: false,
    pathRewrite: (path) => `/api${path}`,
    on: {
        error: (err, req, res) => {
            console.error('Proxy error:', err.message);
            res.status(502).json({ error: 'API недоступен' });
        }
    }
}));

// Serve Vue SPA build
const distDir = path.join(__dirname, 'frontend-dist');
app.use(express.static(distDir));

// SPA fallback — all non-API routes go to index.html
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(distDir, 'index.html'));
    } else {
        next();
    }
});

let server;

if (useHttps) {
    const keyPath = process.env.KEY_PATH,
          crtPath = process.env.CRT_PATH;
    const options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(crtPath)
    };
    server = https.createServer(options, app);
} else {
    server = http.createServer(app);
}

const port   = process.env.WEB_PORT;
server.listen(port, () => {
    const protocol = useHttps ? 'https' : 'http';
    console.log(`${protocol}://localhost:${port}`);
});
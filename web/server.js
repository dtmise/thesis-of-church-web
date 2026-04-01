import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import dotenv from 'dotenv';
import https from 'https';

try {
    dotenv.config();
    const app = express();
    app.use(morgan('combined'));
    app.use(express.static('frontend'));
    const options = { 
        key: fs.readFileSync('./server.key'), 
        cert: fs.readFileSync('./server.cert')
    };
    const server = https.createServer(options, app);
    const port = 443;
    server.listen(port, () => console.log(`https://localhost:${port}`));
} catch (err) {
    throw err;
}
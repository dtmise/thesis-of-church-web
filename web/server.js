import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import https from 'https';

const app = express();
app.use(morgan('combined'));
app.use(express.static('frontend'));
const keyPath = process.env.KEY_PATH,
      crtPath = process.env.CRT_PATH;
const options = { 
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(crtPath)
};
const server = https.createServer(options, app);
const port   = process.env.WEB_PORT;
server.listen(port, () => console.log(`https://localhost:${port}`));
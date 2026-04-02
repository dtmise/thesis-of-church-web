import express from 'express'
import http from 'http'

const redirectTarget = process.env.REDIRECT_TARGET || 'https://computable.tech/';
const app = express();
app.use('/', (req, res) => {
    res.redirect(redirectTarget);
})
const server = http.createServer(app);
const port = process.env.REDIRECT_PORT;
server.listen(port, () => {
    console.log(`Redirect server started on ${port} port`);
});

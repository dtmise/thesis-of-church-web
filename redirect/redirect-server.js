import express from 'express'
import http from 'http'

const app = express();
app.use('/', (req, res) => {
    res.redirect('https://computable.tech/');
})
const server = http.createServer(app);
const port = process.env.REDIRECT_PORT;
server.listen(port, () => {
    console.log(`Redirect server started on ${port} port`);
});

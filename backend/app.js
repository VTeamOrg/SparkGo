require("dotenv").config();

const express = require("express");
const http = require('http');
const cors = require("cors");
const websocket = require('ws');
const loadHttpRoutes = require("./routes/httpRoutes");
const loadWebsocket = require('./routes/websocketRoutes');
const loadAuthRoutes = require('./routes/oauthRoutes');

const app = express();
const server = http.createServer(app);
const wss = new websocket.Server({ server });

// const corsOptions = {
//     origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
//     methods: 'GET,POST',
//     allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'credentials'],
//     credentials: true,
//     optionsSuccessStatus: 200
// };

// Use the cors middleware with your options
app.use(cors());


// Request logging middleware
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Request Headers:', req.headers);
    next();
});

app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.NODE_ENV === "test" ? 1337 : 3000;

app.get("/", (req, res) => {
    res.json({
        data: "Hello World!",
    });
});

loadAuthRoutes(app);
loadHttpRoutes(app);
loadWebsocket(wss);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

app.appServer = server;
module.exports = app;
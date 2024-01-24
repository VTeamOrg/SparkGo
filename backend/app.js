require("dotenv").config();

const express = require("express");
const http = require('http');
const cors = require("cors");
const websocket = require('ws');
var cookieParser = require('cookie-parser');

const loadHttpRoutes = require("./routes/httpRoutes");
const loadWebsocket = require('./routes/websocketRoutes');
const loadAuthRoutes = require('./routes/oauthRoutes');

const app = express();
const server = http.createServer(app);
const wss = new websocket.Server({ server });

const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'localhost:5173', 'localhost:5174', 'http://127.0.0.1:5174',],
    methods: 'GET,POST,UPDATE,PUT,DELETE',
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'credentials'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Use the cors middleware with your options
app.use(cors(corsOptions));


app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Server Error app.js" });
});

const port = process.env.NODE_ENV === "test" ? 1337 : 3000;

app.get("/", (req, res) => {
    res.json({
        data: "Hello World!",
    });
});

app.use(cookieParser( process.env.SESSION_SECRET));

loadAuthRoutes(app);
loadHttpRoutes(app);
loadWebsocket(wss);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

app.appServer = server;
module.exports = app;
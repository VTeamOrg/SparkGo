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


// Configure CORS to allow requests from your frontend URL
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: 'GET,POST', // Specify the methods you want to allow
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization'], // Specify the headers you want to allow
    credentials: true, // If your frontend needs to pass credentials
    optionsSuccessStatus: 200
};

// Use the cors middleware with your options
app.use(cors(corsOptions));

app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const port = process.env.NODE_ENV === "test" ? 1337 : 3000; // Use port 1337 for testing

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
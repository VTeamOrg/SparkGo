require("dotenv").config();

const express = require("express");
const http = require('http');
const cors = require("cors");
const websocket = require('ws');
const loadHttpRoutes = require("./routes/httpRoutes");
const loadWebsocketRoutes = require('./routes/websocketRoutes');


const app = express();
const server = http.createServer(app);
const wss = new websocket.Server({ server });


app.use(cors());
app.options("*", cors());

app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const port = process.env.NODE_ENV === "test" ? 1337 : 3000; // Use port 1337 for testing

app.get("/", (req, res) => {
    res.json({
        data: "Hello World!",
    });
});

loadHttpRoutes(app);
loadWebsocketRoutes(wss);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = app; // Export the app variable

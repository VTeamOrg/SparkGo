require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const tickets = require("./routes/tickets.js");


const app = express();
const httpServer = require("http").createServer(app);

app.use(cors());
app.options("*", cors());

app.disable("x-powered-by");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:9000",
        methods: ["GET", "POST"],
    },
});

const port = 1337;

app.get("/", (req, res) => {
    res.json({
        data: "Hello World!",
    });
});


app.use("/tickets", tickets);


httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

fetchTrainPositions(io);

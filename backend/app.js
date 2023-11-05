require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const fetchTrainPositions = require("./models/trains.js");
const setupSocketServer = require("./models/socket.js");
const delayed = require("./routes/delayed.js");
const tickets = require("./routes/tickets.js");
const stations = require("./routes/stations.js");
const codes = require("./routes/codes.js");
const delayedF = require("./routes/delayed_filter.js");

const app = express();
const httpServer = require("http").createServer(app);

app.use(cors());
app.options("*", cors());

app.disable("x-powered-by");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const io = require("socket.io")(httpServer, {
    cors: {
        origin: [
            "http://localhost:8080",
            "https://www.student.bth.se",
            "https://www.student.bth.se/~adde22/editor/#/",
            "https://www.student.bth.se/~anbx22/editor/#/",
            "https://jsramverk-train-adde22anbx22.azurewebsites.net/delayed",
            "https://jsramverk-train-adde22anbx22.azurewebsites.net/codes",
            "https://jsramverk-train-adde22anbx22.azurewebsites.net/trains",
            "https://jsramverk-train-adde22anbx22.azurewebsites.net/tickets",
            "https://jsramverk-train-adde22anbx22.azurewebsites.net/stations",
            "https://jsramverk-train-adde22anbx22.azurewebsites.net/delayedFiltered",
            "https://jsramverk-train-adde22anbx22.azurewebsites.net",
            "http://localhost:8081",
            "http://localhost:1337/delayed",
            "http://localhost:1337/tickets",
            "http://localhost:1337/stations",
            "http://localhost:1337",
            "http://localhost:1337/delayedFiltered",
            "http://localhost:8081",
            "https://www.student.bth.se",
        ],
        methods: ["GET", "POST"],
    },
});

const port = process.env.PORT || 8081;

app.get("/", (req, res) => {
    res.json({
        data: "Hello World!",
    });
});

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);
app.use("/stations", stations);
app.use("/delayedFilter", delayedF);

httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

fetchTrainPositions(io);
setupSocketServer(io);

module.exports = app; // Export the app variable

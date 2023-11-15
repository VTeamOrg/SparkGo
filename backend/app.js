require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const users = require("./routes/users.js");
const stations = require("./routes/stations.js");
const vehicles = require("./routes/vehicles.js");
const cities = require("./routes/cities.js");

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

app.use("/users", users);
app.use("/stations", stations);
app.use("/vehicles", vehicles);
app.use("/cities", cities);

httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = app; // Export the app variable


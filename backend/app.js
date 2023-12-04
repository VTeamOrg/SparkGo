require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const users = require("./routes/users.js");
const stations = require("./routes/stations.js");
const vehicles = require("./routes/vehicles.js");
const cities = require("./routes/cities.js");
const receipts = require("./routes/receipts.js");

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
            "http://localhost:9000",
            "http://localhost:1337",
            "http://localhost:1337/users",
            "http://localhost:1337/stations",
            "http://localhost:1337/cities",
            "http://localhost:1337/vehicles",
            "http://localhost:1337/receipts",
            "http://127.0.0.1:3306",
            "http://localhost:5137"
        ],
        methods: ["GET", "POST"],
    },
});

const port = process.env.NODE_ENV === "test" ? 1337 : 3000; // Use port 1337 for testing

app.get("/", (req, res) => {
    res.json({
        data: "Hello World!",
    });
});

app.use("/users", users);
app.use("/stations", stations);
app.use("/vehicles", vehicles);
app.use("/cities", cities);
app.use("/receipts", receipts);

httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = app; // Export the app variable

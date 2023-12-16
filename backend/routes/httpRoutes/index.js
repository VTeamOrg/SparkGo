const users = require("./users.js");
const stations = require("./stations.js");
const vehicles = require("./vehicles.js");
const cities = require("./cities.js");
const subscription = require("./subscription.js");
const paymentMethods = require("./paymentMethods.js");

const loadHttpRoutes = (app)=> {
    app.use("/users", users);
    app.use("/stations", stations);
    app.use("/vehicles", vehicles);
    app.use("/cities", cities);
    app.use("/subscription", subscription);
    app.use("/paymentMethods", paymentMethods);
}

module.exports = loadHttpRoutes;

const users = require("./users.js");
const stations = require("./stations.js");
const vehicles = require("./vehicles.js");
const cities = require("./cities.js");
const subscriptions = require("./subscription.js");
const paymentMethods = require("./paymentMethods.js");

const loadHttpRoutes = (app)=> {
    app.use("/users", users);
    app.use("/stations", stations);
    app.use("/vehicles", vehicles);
    app.use("/cities", cities);
    app.use("/subscriptions", subscriptions);
    app.use("/payment_methods", paymentMethods);
}

module.exports = loadHttpRoutes;

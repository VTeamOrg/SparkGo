const users = require("./users.js");
const stations = require("./stations.js");
const vehicles = require("./vehicles.js");
const cities = require("./cities.js");
const subscription = require("./subscription.js");
const paymentMethods = require("./paymentMethods.js");
const activePlan = require("./activePlan.js");
const frequencies = require("./frequencies.js");
const plans = require("./plans.js");
const priceList = require("./priceList.js");
const receipts = require("./receipts.js");
const vehicleTypes = require("./vehicleTypes.js");
const coords = require("./coords.js");
const logout = require("./logout.js");
const validateSession = require("./validateSession.js");
const { generalApiLimiter } = require("../../middleware/apiLimter.js");


const loadHttpRoutes = (app) => {
    app.use("/v1/users", users);
    app.use("/v1/stations", stations);
    app.use("/v1/vehicles", vehicles);
    app.use("/v1/cities", cities);
    app.use("/v1/subscription", subscription);
    app.use("/v1/paymentMethods", paymentMethods);
    app.use("/v1/plans", plans);
    app.use("/v1/pricelist", priceList);
    app.use("/v1/receipts", receipts);
    app.use("/v1/vehicleTypes", vehicleTypes);
    app.use("/v1/coords", coords);
    app.use("/v1/activePlan", activePlan);
    app.use("/v1/frequencies", frequencies);
    app.use("/v1/logout", logout);
    app.use("/v1/validate-session", validateSession);
}

// Function to load HTTP routes with rate limiters
// const loadHttpRoutes = (app) => {
//   app.use("/v1/users", generalApiLimiter, users);
//   app.use("/v1/stations", generalApiLimiter, stations);
//   app.use("/v1/vehicles", generalApiLimiter, vehicles);
//   app.use("/v1/cities", generalApiLimiter, cities);
//   app.use("/v1/subscription", generalApiLimiter, subscription);
//   app.use("/v1/paymentMethods", generalApiLimiter, paymentMethods);
//   app.use("/v1/activePlan", generalApiLimiter, activePlan);
//   app.use("/v1/frequencies", generalApiLimiter, frequencies);
//   app.use("/v1/plans", generalApiLimiter, plans);
//   app.use("/v1/priceList", generalApiLimiter, priceList);
//   app.use("/v1/receipts", generalApiLimiter, receipts);
//   app.use("/v1/vehicleTypes", generalApiLimiter, vehicleTypes);
// };

module.exports = loadHttpRoutes;

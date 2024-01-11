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
const { generalApiLimiter } = require("../../middleware/apiLimter.js");


// Function to load HTTP routes without rate limiters
const loadHttpRoutes = (app) => {
  app.use("/v1/users", users);
  app.use("/v1/stations", stations);
  app.use("/v1/vehicles", vehicles);
  app.use("/v1/cities", cities);
  app.use("/v1/subscription", subscription);
  app.use("/v1/paymentMethods", paymentMethods);
  app.use("/v1/activePlan", activePlan);
  app.use("/v1/frequencies", frequencies);
  app.use("/v1/plans", plans);
  app.use("/v1/priceList", priceList);
  app.use("/v1/receipts", receipts);
  app.use("/v1/vehicleTypes", vehicleTypes);
};

module.exports = loadHttpRoutes;

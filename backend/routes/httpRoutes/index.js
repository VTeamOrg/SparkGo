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

const loadHttpRoutes = (app) => {
  app.use("/users", users);
  app.use("/stations", stations);
  app.use("/vehicles", vehicles);
  app.use("/cities", cities);
  app.use("/subscription", subscription);
  app.use("/paymentMethods", paymentMethods);
  app.use("/activePlan", activePlan);
  app.use("/frequencies", frequencies);
  app.use("/plans", plans);
  app.use("/priceList", priceList);
  app.use("/receipts", receipts);
  app.use("/vehicleTypes", vehicleTypes);
};

module.exports = loadHttpRoutes;

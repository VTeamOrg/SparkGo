const auth = require("./auth.js");
const request = require("./request.js");
const { authApiLimiter } = require("../../middleware/apiLimter.js");


// Apply a stricter limiter to authentication routes
const loadAuthRoutes = (app) => {
    app.use("/v1/auth", authApiLimiter, auth);
    app.use("/v1/request", request);
  };

module.exports = loadAuthRoutes;

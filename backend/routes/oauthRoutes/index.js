const auth = require("./auth.js");
const request = require("./request.js");




const loadAuthRoutes = (app) => {
    app.use("/v1/auth", auth);
    app.use("/v1/request", request);

}

module.exports = loadAuthRoutes;

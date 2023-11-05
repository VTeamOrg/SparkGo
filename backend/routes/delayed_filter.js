const express = require("express");
const router = express.Router();

const delayed = require("../models/delayed_filter.js");

router.get("/", (req, res) => {
    delayed.getDelayedTrains(req, res).then((result) => {
        const delayedTrainNumbers = result.operationalTrainNumbers.sort(
            (a, b) => b - a
        );
        res.send(delayedTrainNumbers);
    });
});
module.exports = router;

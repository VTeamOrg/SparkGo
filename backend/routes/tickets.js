const express = require("express");
const router = express.Router();
const { NODE_ENV } = process.env; // Get the NODE_ENV environment variable

let ticketsModule;

if (NODE_ENV === "test") {
    // Use the test version of the tickets module when NODE_ENV is set to 'test'
    ticketsModule = require("../models/tickets-test.js");
} else {
    // Use the production version of the tickets module for other environments
    ticketsModule = require("../models/tickets.js");
}

router.get("/", (req, res) => ticketsModule.getTickets(req, res));

router.get("/:activityId", (req, res) =>
    ticketsModule.getTicketsByActivityId(req, res)
);

router.post("/", (req, res) => ticketsModule.createTicket(req, res));

// PUT route to update a ticket by ID
router.put("/:activityId", (req, res) => ticketsModule.updateTicket(req, res));

// DELETE route to delete a ticket by ID
router.delete("/:activityId", (req, res) =>
    ticketsModule.deleteTicket(req, res)
);

module.exports = router;

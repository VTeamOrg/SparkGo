const express = require("express");
const router = express.Router();

let ticketsModule;


ticketsModule = require("../models/tickets.js");

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

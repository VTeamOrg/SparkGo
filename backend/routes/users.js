const express = require("express");
const router = express.Router();

let usersModule;

usersModule = require("../models/users.js");

router.get("/", (req, res) => usersModule.getAllUsers(req, res));

router.get("/:id", (req, res) => usersModule.getUserById(req, res));

router.post("/", (req, res) => usersModule.createUser(req, res));

// PUT route to update a user by ID
router.put("/:id", (req, res) => usersModule.updateUser(req, res));

// DELETE route to delete a user by ID
router.delete("/:id", (req, res) => usersModule.deleteUser(req, res));

module.exports = router;

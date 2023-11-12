const express = require("express");
const router = express.Router();

let usersModule;

usersModule = require("../models/users.js");

router.get("/", (req, res) => usersModule.getAllUsers(req, res));

router.get("/:Id", (req, res) => usersModule.getUserById(req, res));

router.post("/", (req, res) => usersModule.createUser(req, res));

// PUT route to update a user by ID
router.put("/:userId", (req, res) => usersModule.updateUser(req, res));

// DELETE route to delete a user by ID
router.delete("/:userId", (req, res) => usersModule.deleteUser(req, res));

module.exports = router;

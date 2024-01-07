const express = require("express");
const router = express.Router();

let usersController = require("../../controllers/usersController.js");

router.get("/", usersController.getAllUsers);
console.log("Reached /v1/users route");
router.get("/email/:email", usersController.getUserByEmail);

router.get("/:id", usersController.getUserById);
console.log("Reached /v1/users/:id route");

router.post("/", usersController.createUser);

// PUT route to update a user by ID
router.put("/:id", usersController.updateUser);

// DELETE route to delete a user by ID
router.delete("/:id", usersController.deleteUser);

router.get("/isAdminByEmail/:email", usersController.isAdminByEmail);

module.exports = router;

const express = require("express");
const router = express.Router();

let usersConroller = require("../../controllers/usersController.js");

router.get("/", usersConroller.getAllUsers);
console.log("Reached /v1/users route");
router.get("/email/:email", usersConroller.getUserByEmail);

router.get("/:id", usersConroller.getUserById);
console.log("Reached /v1/users/:id route");

router.post("/", usersConroller.createUser);

// PUT route to update a user by ID
router.put("/:id", usersConroller.updateUser);

// DELETE route to delete a user by ID
router.delete("/:id", usersConroller.deleteUser);

module.exports = router;

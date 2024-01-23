const express = require("express");
const router = express.Router();
const adminOnlyAccess = require('../../middleware/adminOnlyAccess.js');
let usersController = require("../../controllers/usersController.js");

router.get("/", usersController.getAllUsers);

router.get("/email/:email", usersController.getUserByEmail);

router.get("/:id", usersController.getUserById);

router.post("/", usersController.createUser);

// PUT route to update a user by ID
router.put("/:id", usersController.updateUser);

// DELETE route to delete a user by ID
router.delete("/:id", usersController.deleteUser);

router.get("/isAdminByEmail/:email", usersController.isAdminByEmail);

router.get("/vehiclePrice/:vehicleType", usersController.getUserVehiclePrice);

module.exports = router;
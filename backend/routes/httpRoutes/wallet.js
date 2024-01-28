const express = require("express");
const walletController = require("../../controllers/walletController");
const router = express.Router();
/* GET routes */
router.get("/:userId", (req, res) => walletController.getWalletCredits(req, res));

module.exports = router;

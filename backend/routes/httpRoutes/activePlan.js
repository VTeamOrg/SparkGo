const express = require("express");
const router = express.Router();
const activePlanController = require("../../controllers/activePlanController");

/* GET routes */
router.get("/", (req, res) => activePlanController.getAllActivePlans(req, res));
router.get("/:activePlanId", (req, res) => activePlanController.getActivePlanById(req, res));
router.get("/memberid/:memberId", (req, res) => activePlanController.getActivePlanByMemberId(req, res));

router.post("/", (req, res) => activePlanController.createActivePlan(req, res));

router.put("/:activePlanId", (req, res) => activePlanController.updateActivePlan(req, res));

router.delete("/:activePlanId", (req, res) => activePlanController.deleteActivePlan(req, res));

module.exports = router;

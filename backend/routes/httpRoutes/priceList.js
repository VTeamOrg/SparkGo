const express = require("express");
const router = express.Router();
const priceListController = require("../../controllers/priceListController.js");
const adminOnlyAccess = require('../../middleware/adminOnlyAccess.js');

router.get("/", priceListController.getAllPriceListItems);
router.get("/:itemId", priceListController.getPriceListItemById);

router.post("/", adminOnlyAccess, priceListController.createPriceListItem);
router.put("/:itemId", adminOnlyAccess, priceListController.updatePriceListItem);
router.delete("/:itemId", adminOnlyAccess, priceListController.deletePriceListItem);

module.exports = router;

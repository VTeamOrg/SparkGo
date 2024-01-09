const express = require("express");
const router = express.Router();

const priceListController = require("../../controllers/priceListController.js");

router.get("/", priceListController.getAllPriceListItems);
router.get("/:itemId", priceListController.getPriceListItemById);

router.post("/", priceListController.createPriceListItem);

router.put("/:itemId", priceListController.updatePriceListItem);

router.delete("/:itemId", priceListController.deletePriceListItem);

module.exports = router;

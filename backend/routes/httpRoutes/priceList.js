const express = require("express");
const router = express.Router();
const priceListModule = require("../../models/priceList.js");

router.get("/", (req, res) => priceListModule.getAllPriceListItems(req, res));
router.get("/:itemId", (req, res) => priceListModule.getPriceListItemById(req, res));

router.post("/", (req, res) => priceListModule.createPriceListItem(req, res));

router.put("/:itemId", (req, res) => priceListModule.updatePriceListItem(req, res));

router.delete("/:itemId", (req, res) => priceListModule.deletePriceListItem(req, res));

module.exports = router;

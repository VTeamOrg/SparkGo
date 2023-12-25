const priceListModel = require("../models/priceListModel.js");

const priceListController = {
    getAllPriceListItems: async function (req, res) {
        try {
            const allPriceListItems = await priceListModel.getAllPriceListItems();
            return res.json({
                data: allPriceListItems,
            });
        } catch (error) {
            console.error("Error getting pricelists:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getPriceListItemById: async function (req, res) {
        try {
            const itemId = req.params.itemId;
            const priceListItem = await priceListModel.getPriceListItemById(itemId);

            return res.json({
                data: priceListItem,
            });
        } catch (error) {
            console.error("Error getting pricelist:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createPriceListItem: async function (req, res) {
        try {
            const { type_id, list_name, price_per_minute, price_per_unlock } = req.body;
            const result = await priceListModel.createPriceListItem(type_id, list_name, price_per_minute, price_per_unlock);

            return res.json({
                message: "Price list item created successfully",
                insertedId: result.insertId,
            });
        } catch (error) {
            console.error("Error creating price list item:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updatePriceListItem: async function (req, res) {
        try {
            const itemId = req.params.itemId;
            const { type_id, list_name, price_per_minute, price_per_unlock } = req.body;

            await priceListModel.updatePriceListItem(itemId, type_id, list_name, price_per_minute, price_per_unlock);

            return res.json({
                message: "Price list item updated successfully",
            });
        } catch (error) {
            console.error("Error updating price list item:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deletePriceListItem: async function (req, res) {
        try {
            const itemId = req.params.itemId;
            await priceListModel.deletePriceListItem(itemId);

            return res.json({
                message: "Price list item deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting price list item:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = priceListController;

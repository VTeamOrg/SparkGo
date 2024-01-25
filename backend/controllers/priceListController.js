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
            return res.status(500).json({ error: `Failed to get all price list items: ${error.message}` });
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
            return res.status(500).json({ error: `Failed to get price list item by ID: ${error.message}` });
        }
    },

    createPriceListItem: async function (req, res) {
        try {
            const { type_id, list_name, price_per_minute, price_per_unlock, discount } = req.body;
            const result = await priceListModel.createPriceListItem({
                type_id,
                list_name,
                price_per_minute,
                price_per_unlock,
                discount
            });

            return res.status(201).json({
                message: "Price list item created successfully",
                insertedId: result.insertId,
            });
        } catch (error) {
            console.error("Error creating price list item:", error.message);
            return res.status(500).json({ error: `Failed to create price list item: ${error.message}` });
        }
    },

    updatePriceListItem: async function (req, res) {
        try {
            const itemId = req.params.itemId;
            const { type_id, list_name, price_per_minute, price_per_unlock, discount } = req.body;

            await priceListModel.updatePriceListItem(itemId, {
                type_id,
                list_name,
                price_per_minute,
                price_per_unlock,
                discount
            });

            return res.json({
                message: "Price list item updated successfully",
            });
        } catch (error) {
            console.error("Error updating price list item:", error.message);
            return res.status(500).json({ error: `Failed to update price list item: ${error.message}` });
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
            return res.status(500).json({ error: `Failed to delete price list item: ${error.message}` });
        }
    },
};

module.exports = priceListController;
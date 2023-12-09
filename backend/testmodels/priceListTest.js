const database = require("../db/database.js");

const priceList = {
    getAllPriceListItems: async function () {
        try {
            const db = await database.openDb();
            const allPriceListItems = await database.query(
                db,
                "SELECT * FROM v_price_list"
            );

            await database.closeDb(db);

            return allPriceListItems;
        } catch (error) {
            console.error("Error querying database:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    createPriceListItem: async function (
        type_id,
        list_name,
        price_per_minute,
        price_per_unlock
    ) {
        try {
            const db = await database.openDb();
            const result = await database.query(
                db,
                "INSERT INTO price_list (type_id, list_name, price_per_minute, price_per_unlock) VALUES (?, ?, ?, ?)",
                [type_id, list_name, price_per_minute, price_per_unlock]
            );

            await database.closeDb(db);

            return {
                message: "Price list item created successfully",
                insertedId: result.insertId,
            };
        } catch (error) {
            console.error("Error creating price list item:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    updatePriceListItem: async function (
        itemId,
        type_id,
        list_name,
        price_per_minute,
        price_per_unlock
    ) {
        try {
            const db = await database.openDb();
            await database.query(
                db,
                "UPDATE price_list SET type_id = ?, list_name = ?, price_per_minute = ?, price_per_unlock = ? WHERE id = ?",
                [type_id, list_name, price_per_minute, price_per_unlock, itemId]
            );

            await database.closeDb(db);

            return { message: "Price list item updated successfully" };
        } catch (error) {
            console.error("Error updating price list item:", error.message);
            throw new Error("Internal Server Error");
        }
    },

    deletePriceListItem: async function (itemId) {
        try {
            const db = await database.openDb();
            await database.query(db, "DELETE FROM price_list WHERE id = ?", [
                itemId,
            ]);

            await database.closeDb(db);

            return { message: "Price list item deleted successfully" };
        } catch (error) {
            console.error("Error deleting price list item:", error.message);
            throw new Error("Internal Server Error");
        }
    },
};

module.exports = priceList;

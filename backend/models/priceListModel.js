const database = require("../db/database.js");

const priceListModel = {
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
            throw error;
        }
    },

    getPriceListItemById: async function (itemId) {
        try {
            const db = await database.openDb();
            const priceListItem = await database.query(
                db,
                "SELECT * FROM v_price_list WHERE id = ?;",
                itemId
            );
            await database.closeDb(db);
            return priceListItem[0];
        } catch (error) {
            throw error;
        }
    },
    getPriceListItemByTypeId: async function (typeId) {
        try {
            const db = await database.openDb();
            const priceListItem = await database.query(
                db,
                "SELECT * FROM v_price_list WHERE type_id = ?;",
                typeId
            );
            await database.closeDb(db);
            return priceListItem[0];
        } catch (error) {
            throw error;
        }
    },

    createPriceListItem: async function ({ type_id, list_name, price_per_minute, price_per_unlock, discount }) {
        try {
            const db = await database.openDb();
            const result = await database.query(
                db,
                "INSERT INTO price_list (type_id, list_name, price_per_minute, price_per_unlock, discount) VALUES (?, ?, ?, ?, ?)",
                [type_id, list_name, price_per_minute, price_per_unlock, discount]
            );
            await database.closeDb(db);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    updatePriceListItem: async function (itemId, { type_id, list_name, price_per_minute, price_per_unlock, discount }) {
        try {
            const db = await database.openDb();
            await database.query(
                db,
                "UPDATE price_list SET type_id = ?, list_name = ?, price_per_minute = ?, price_per_unlock = ?, discount = ? WHERE id = ?",
                [type_id, list_name, price_per_minute, price_per_unlock, discount, itemId]
            );
            await database.closeDb(db);
        } catch (error) {
            throw error;
        }
    },
    

    deletePriceListItem: async function (itemId) {
        console.log("delete");
        try {
            const db = await database.openDb();
            await database.query(db, "DELETE FROM price_list WHERE id = ?", [itemId]);
            await database.closeDb(db);
        } catch (error) {
            throw error;
        }
    },
};

module.exports = priceListModel;

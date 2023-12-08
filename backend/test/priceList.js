const sinon = require("sinon");
const chai = require("chai");
const chaiHttp = require("chai-http");

const priceListTest = require("../../backend/testmodels/priceListest.js");
const database = require("../db/database.js");

chai.should();
chai.use(chaiHttp);

describe("Price List Model Tests", () => {
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(database, "openDb").resolves({}); // Stub the openDb function
        sandbox.stub(database, "query").resolves({}); // Mock data accordingly
        sandbox.stub(database, "closeDb").resolves(); // Stub the closeDb function
    });

    after(() => {
        sandbox.restore();
    });

    describe("Get All Price List Items", () => {
        it("should retrieve all price list items from the database", async () => {
            try {
                const allItems = await priceListTest.getAllPriceListItems();
                console.log(allItems); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Create Price List Item", () => {
        it("should create a new price list item in the database", async () => {
            try {
                const newItem = await priceListTest.createPriceListItem(
                    123, // type_id
                    "New List", // list_name
                    50, // price_per_minute
                    20 // price_per_unlock
                );
                console.log(newItem); // Log or assert based on the result
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Update Price List Item", () => {
        it("should update a price list item in the database", async () => {
            try {
                const itemId = 1; // Replace with the item ID you want to update
                const updatedItem = await priceListTest.updatePriceListItem(
                    itemId,
                    123, // type_id
                    "Updated List", // list_name
                    50, // price_per_minute
                    20 // price_per_unlock
                );
                console.log(updatedItem); // Log or assert based on the result
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Delete Price List Item", () => {
        it("should delete a price list item from the database", async () => {
            try {
                const itemId = 1; // Replace with the item ID you want to delete
                const deletedItem = await priceListTest.deletePriceListItem(
                    itemId
                );
                console.log(deletedItem); // Log or assert based on the result
            } catch (error) {
                throw error;
            }
        });
    });
});

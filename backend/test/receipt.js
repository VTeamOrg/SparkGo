const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

const receiptModel = require("../../backend/testmodels/receiptest.js"); // Import your receipt model
const database = require("../../backend/db/database.js"); // Import your database functions

describe("Receipt Model Tests", () => {
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(database, "openDb").resolves({}); // Stub the openDb function
        sandbox.stub(database, "query").resolves({
            /* mock data */
        }); // Stub the query function
        sandbox.stub(database, "closeDb").resolves(); // Stub the closeDb function
    });

    after(() => {
        sandbox.restore();
    });

    describe("Get All Receipts", () => {
        it("should retrieve all receipts from the database", async () => {
            try {
                const allReceipts = await receiptModel.getAllReceipt({});
                console.log(allReceipts); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get Receipt by Member ID", () => {
        it("should retrieve a receipt by member ID from the database", async () => {
            try {
                const receipt = await receiptModel.getReceiptByMemberId({
                    params: { member_id: 1 },
                });
                console.log(receipt); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get Receipt by ID", () => {
        it("should retrieve a receipt by ID from the database", async () => {
            try {
                const receipt = await receiptModel.getReceiptById({
                    params: { id: 1 },
                });
                console.log(receipt); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Generate Receipt", () => {
        it("should generate a receipt in the database", async () => {
            try {
                const generatedReceipt = await receiptModel.generateReceipt({
                    body: { rent_id: 1 }, // Assuming rent_id is provided in the request body
                });
                console.log(generatedReceipt); // Log or assert based on the generated receipt data
            } catch (error) {
                throw error;
            }
        });
    });
});

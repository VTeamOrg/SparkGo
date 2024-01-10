const chai = require("chai");
const sinon = require("sinon");

chai.should();

const paymentMethods = require("../../testmodels/paymentMethodsTest.js"); // Replace with your paymentMethods model
const database = require("../../db/database.js"); // Replace with your database functions

describe("PaymentMethods Model Tests", () => {
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

    describe("Get Payment Method", () => {
        it("should retrieve payment method data from the database", async () => {
            try {
                const paymentMethodData =
                    await paymentMethods.getPaymentMethod();
                console.log(paymentMethodData); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get Payment Method by Member ID", () => {
        it("should retrieve payment method data by member ID from the database", async () => {
            try {
                const memberId = 1; // Replace with the member ID you want to retrieve
                const memberPaymentMethod =
                    await paymentMethods.getPaymentMethodByMemberId(memberId);
                console.log(memberPaymentMethod); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    // Add more test cases for create, update, and delete if needed
});

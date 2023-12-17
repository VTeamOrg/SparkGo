const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

const database = require("../../backend/db/database.js");
const subscription = require("../../backend/testmodels/subscriptionTest.js");

describe("Subscription Model Tests", () => {
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(database, "openDb").resolves({});
        sandbox.stub(database, "query").resolves({});
        sandbox.stub(database, "closeDb").resolves({});
    });

    after(() => {
        sandbox.restore();
    });

    describe("Get All Subscriptions", () => {
        it("should retrieve all subscriptions from the database", async () => {
            try {
                const allSubscriptions = await subscription.getSubscription();
                console.log(allSubscriptions); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get Subscription By Member ID", () => {
        it("should retrieve a subscription by member ID from the database", async () => {
            try {
                const memberId = 1; // Replace with the member ID you want to retrieve
                const memberSubscription =
                    await subscription.getSubscriptionByMemberId(memberId);
                console.log(memberSubscription); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Update Subscription", () => {
        it("should update a subscription in the database", async () => {
            try {
                const memberId = 1; // Replace with the member ID you want to update
                const isPaused = true; // Replace with the isPaused value you want to update
                const result = await subscription.updateSubscription(
                    memberId,
                    isPaused
                );
                console.log(result); // Log or assert based on the result
            } catch (error) {
                throw error;
            }
        });
    });
});

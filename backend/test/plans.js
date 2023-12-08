const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

const plansModel = require("../../backend/testmodels/planstest.js"); // Import your plans model
const database = require("../../backend/db/database.js"); // Import your database functions

describe("Plans Model Tests", () => {
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

    describe("Get All Plans", () => {
        it("should retrieve all plans from the database", async () => {
            try {
                const allPlans = await plansModel.getAllPlans({});
                console.log(allPlans); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get Plan by ID", () => {
        it("should retrieve a plan by ID from the database", async () => {
            try {
                const plan = await plansModel.getPlanById({
                    params: { planId: 1 },
                });
                console.log(plan); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Create Plan", () => {
        it("should create a plan in the database", async () => {
            try {
                const newPlan = await plansModel.createPlan({
                    body: {
                        title: "New Plan",
                        description: "Description",
                        price: 100,
                        // Include other required fields
                    },
                });
                console.log(newPlan); // Log or assert based on the generated plan data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Update Plan", () => {
        it("should update a plan in the database", async () => {
            try {
                const planId = 1; // Set the plan ID you want to update
                const updatedPlan = await plansModel.updatePlan(planId, {
                    title: "Updated Plan",
                    description: "Updated Description",
                    price: 150,
                    // Include other fields to update
                });
                console.log(updatedPlan); // Log or assert based on the updated plan data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Delete Plan", () => {
        it("should delete a plan from the database", async () => {
            try {
                const deletedPlan = await plansModel.deletePlan({
                    params: { planId: 1 },
                });
                console.log(deletedPlan); // Log or assert based on the deletion result
            } catch (error) {
                throw error;
            }
        });
    });
});

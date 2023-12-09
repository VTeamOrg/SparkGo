const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

const frequencyModel = require("../../backend/testmodels/frequenciestest.js"); // Import your frequency model
const database = require("../../backend/db/database.js"); // Import your database functions

describe("Frequency Model Tests", () => {
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

    describe("Get All Frequencies", () => {
        it("should retrieve all frequencies from the database", async () => {
            try {
                const allFrequencies = await frequencyModel.getAllFrequencies(
                    {}
                );
                console.log(allFrequencies); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get Frequency by ID", () => {
        it("should retrieve a frequency by ID from the database", async () => {
            try {
                const frequency = await frequencyModel.getFrequencyById({
                    params: { frequencyId: 1 },
                });
                console.log(frequency); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    // Add more test cases for other functions in the frequency model if needed
});

const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

const stationsModel = require("../../backend/testmodels/stationTest.js"); // Import your station model
const database = require("../../backend/db/database.js"); // Import your database functions

describe("Station Model Tests", () => {
    let sandbox;
    let connection;

    before(() => {
        sandbox = sinon.createSandbox();
        // Stub the database functions
        sandbox.stub(database, "openDb").resolves({}); // Stub the openDb function
        sandbox.stub(database, "query").resolves({
            /* mock data */
        }); // Stub the query function
        sandbox.stub(database, "closeDb").resolves(); // Stub the closeDb function

        // Simulate an open connection for testing
        connection = {}; // Replace this with your mock connection object if required
    });

    after(() => {
        sandbox.restore();
    });

    describe("Create Station (POST)", () => {
        it("should manually insert a station into the database", async () => {
            const insertParams = ["Test Station", 123.45, 67.89, 1]; // Sample parameters for creating a station

            try {
                // Insert a station manually into the database using stationsModel
                await stationsModel.createStation(...insertParams);
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get Station by ID (GET)", () => {
        it("should retrieve a station by ID from the database", async () => {
            try {
                // Attempt to get the station with ID 11 using stationsModel.getStationById
                const station = await stationsModel.getStationById(11);
                // Log or assert based on the received station data
                console.log(station);
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Update Station by ID (PUT)", () => {
        it("should manually update a station by ID in the database", async () => {
            const updateParams = ["New Station Name", 123.45, 67.89, 1, 11]; // Assuming the ID to update is 11

            try {
                // Update a station manually in the database using stationsModel
                await stationsModel.updateStation(...updateParams);
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Delete Station by ID (DELETE)", () => {
        it("should manually delete a station by ID from the database", async () => {
            try {
                // Delete a station manually from the database using stationsModel
                await stationsModel.deleteStation(11); // Assuming the ID to delete is 11
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get Station by ID (GET)", () => {
        it("should retrieve a station by ID from the database", async () => {
            try {
                // Attempt to get the station with ID 11
                const station = await stationsModel.getStationById(11);
                // Log or assert based on the received station data
                console.log(station);
            } catch (error) {
                throw error;
            }
        });
    });
});

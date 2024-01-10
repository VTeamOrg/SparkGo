const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const vehiclesModel = require("../../testmodels/vehicles.js"); // Import your vehicle model
const database = require("../../db/database.js"); // Import your database functions

chai.should();
chai.use(chaiHttp);

describe("Vehicle Model Behavior", () => {
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

    describe("Create Vehicle (POST)", () => {
        it("should manually insert a vehicle into the database", async () => {
            try {
                // Insert a vehicle manually into the database
                await vehiclesModel.createVehicle({
                    city_id: 1,
                    type_id: 2,
                    rented_by: 3,
                });
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get Vehicle by ID (GET)", () => {
        it("should retrieve a vehicle by ID from the database", async () => {
            try {
                // Attempt to get the vehicle with ID 11
                const vehicle = await vehiclesModel.getVehicleById(11);
                // Log or assert based on the received vehicle data
                console.log(vehicle);
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Update Vehicle by ID (PUT)", () => {
        it("should manually update a vehicle by ID in the database", async () => {
            try {
                // Update a vehicle manually in the database
                const updatedVehicle = await vehiclesModel.updateVehicle(11, {
                    city_id: 4,
                    type_id: 5,
                    rented_by: 6,
                });
                // Log or assert based on the updated vehicle data
                console.log(updatedVehicle);
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Delete Vehicle by ID (DELETE)", () => {
        it("should manually delete a vehicle by ID from the database", async () => {
            try {
                // Delete a vehicle manually from the database
                const result = await vehiclesModel.deleteVehicle(11);
                // Log or assert based on the result
                console.log(result);
            } catch (error) {
                throw error;
            }
        });
    });
});

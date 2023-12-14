const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

const vehicleTypeModel = require("../../backend/testmodels/vehicleTypesTest.js"); // Replace with your vehicleType model
const database = require("../../backend/db/database.js"); // Replace with your database functions

describe("VehicleType Model Tests", () => {
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

    describe("Get All Vehicle Types", () => {
        it("should retrieve all vehicle types from the database", async () => {
            try {
                const allVehicleTypes =
                    await vehicleTypeModel.getAllVehicleTypes();
                console.log(allVehicleTypes); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get Vehicle Type by ID", () => {
        it("should retrieve a vehicle type by ID from the database", async () => {
            try {
                const typeId = 1; // Replace with the type ID you want to retrieve
                const vehicleType = await vehicleTypeModel.getVehicleTypeById(
                    typeId
                );
                console.log(vehicleType); // Log or assert based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Create Vehicle Type", () => {
        it("should create a vehicle type in the database", async () => {
            try {
                const result = await vehicleTypeModel.createVehicleType("SUV");
                console.log(result); // Log or assert based on the result
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Update Vehicle Type", () => {
        it("should update a vehicle type in the database", async () => {
            try {
                const typeId = 1; // Replace with the type ID you want to update
                const result = await vehicleTypeModel.updateVehicleType(
                    typeId,
                    "Updated SUV"
                );
                console.log(result); // Log or assert based on the result
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Delete Vehicle Type", () => {
        it("should delete a vehicle type from the database", async () => {
            try {
                const typeId = 1; // Replace with the type ID you want to delete
                const result = await vehicleTypeModel.deleteVehicleType(typeId);
                console.log(result); // Log or assert based on the result
            } catch (error) {
                throw error;
            }
        });
    });
});

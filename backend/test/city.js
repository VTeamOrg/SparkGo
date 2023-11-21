const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const citiesModel = require("../../backend/models/cities.js");
const database = require("../../backend/db/database.js"); // Import your database functions

chai.should();
chai.use(chaiHttp);

describe("Server Connection Behavior", () => {
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

    describe("Create City (POST)", () => {
        it("should manually insert a city into the database", async () => {
            const insertSql = "INSERT INTO city (name) VALUES (?)";
            const insertParams = ["Test City"];

            try {
                // Insert a city manually into the database using citiesModel query
                await citiesModel.createCity(
                    connection,
                    insertSql,
                    insertParams
                );
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get City by ID (GET)", () => {
        it("should retrieve a city by ID from the database", async () => {
            try {
                // Attempt to get the city with ID 11 using citiesModel.getCityById
                const req = { params: { cityId: 11 } }; // Mock request object with cityId 11
                const res = {
                    json: (data) => {
                        console.log(data); // Log the received data for testing purposes
                    },
                    status: (statusCode) => {
                        return { json: (error) => console.log(error) };
                    },
                };
                await citiesModel.getCityById(req, res);
                // Perform assertions based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Update City by ID (PUT)", () => {
        it("should manually update a city by ID in the database", async () => {
            const updateSql = "UPDATE city SET name = ? WHERE id = ?";
            const updateParams = ["New City Name", 11]; // Assuming the ID to update is 11

            try {
                // Update a city manually in the database using citiesModel query
                await citiesModel.updateCity(
                    connection,
                    updateSql,
                    updateParams
                );
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Delete City by ID (DELETE)", () => {
        it("should manually delete a city by ID from the database", async () => {
            const deleteSql = "DELETE FROM city WHERE id = ?";

            try {
                // Delete a city manually from the database using citiesModel query
                await citiesModel.deleteCity(connection, deleteSql, [11]); // Assuming the ID to delete is 11
            } catch (error) {
                throw error;
            }
        });
    });
});

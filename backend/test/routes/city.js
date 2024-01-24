const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const citiesModel = require("../../testmodels/citiesTest.js");
const database = require("../../db/database.js"); // Import your database functions

chai.should();
chai.use(chaiHttp);

describe("Server Connection Behavior", () => {
    let sandbox;
    let connection;


    before(() => {
        sandbox = sinon.createSandbox();

        // Stub the database functions
        originalOpenDb = database.openDb; // Store the original database.openDb function
        originalQuery = database.query; //
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

    it("should handle the case when database connection fails during insertion", async () => {
        const insertSql = "INSERT INTO city (name) VALUES (?)";
        const insertParams = ["Test City"];

        
        
        // Replace openDb with a custom function that always rejects
        database.openDb = async () => {
            throw new Error("Database connection failed");
        };

        try {
            // Attempt to insert a city when the database connection fails
            await citiesModel.createCity(
                connection,
                insertSql,
                insertParams
            );
            // Perform assertions for handling database connection failure
        } catch (error) {
            // Assert that the error message indicates a database connection failure
            expect(error.message).to.equal("Database connection failed");
        } finally {
            // Restore the original openDb function
            database.openDb = originalOpenDb;
        }
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

        describe("Get All Cities (GET)", () => {
            it("should retrieve all cities from the database", async () => {
                try {
                    // Attempt to get all cities using citiesModel.getAllCities
                    const cities = await citiesModel.getAllCities();
                    // You can add additional assertions or checks here if needed
                } catch (error) {
                    throw error;
                }
            });
        
            it("should handle the case when database query fails during getAllCities", async () => {
                // Replace query with a custom function that always rejects
                database.query = async () => {
                    throw new Error("Database query failed");
                };
        
                try {
                    // Attempt to get all cities when the database query fails
                    await citiesModel.getAllCities();
                    // Perform assertions for handling database query failure
                } catch (error) {
                    // Assert that the error message indicates a database query failure
                    expect(error.message).to.equal("Database query failed");
                } finally {
                    // Restore the original query function
                    database.query = originalQuery;
                }
            });
        });
    });
});
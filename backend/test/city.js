const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
const expect = chai.expect;

// Replace the actual MySQL pool and functions with stubs/mocks
const pool = {
    getConnection: sinon.stub(),
};
const openDb = sinon.stub();
const closeDb = sinon.stub();
const query = sinon.stub();

// Stub the connection methods
pool.getConnection.callsFake((callback) => {
    callback(null, { release: sinon.stub() }); // Mocking the connection object with a release method
});

// Assign the stubs to the methods you're replacing
const database = {
    openDb,
    closeDb,
    query,
};

// Now replace the original database functions in your city model with the stubs
const citiesModel = require("../../backend/models/cities.js");
citiesModel.__Rewire__("openDb", openDb);
citiesModel.__Rewire__("closeDb", closeDb);
citiesModel.__Rewire__("query", query);

chai.should();
chai.use(chaiHttp);

describe("City API with MySQL", () => {
    let connection;

    before(async () => {
        try {
            // Initialize a database connection before running tests
            connection = await openDb();
        } catch (error) {
            throw error;
        }
    });

    after(async () => {
        try {
            // Close the database connection after running tests
            await closeDb(connection);
        } catch (error) {
            throw error;
        }
    });

    describe("Create City (POST)", () => {
        it("should manually insert a city into the database", async () => {
            const insertSql = "INSERT INTO city (name) VALUES (?)";
            const insertParams = ["Test City"];

            try {
                // Insert a city manually into the database
                await query(connection, insertSql, insertParams);
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get City by ID (GET)", () => {
        it("should retrieve a city by ID from the database", async () => {
            try {
                // Attempt to get the city with ID 11
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
                // Update a city manually in the database
                await query(connection, updateSql, updateParams);
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Delete City by ID (DELETE)", () => {
        it("should manually delete a city by ID from the database", async () => {
            const deleteSql = "DELETE FROM city WHERE id = ?";

            try {
                // Delete a city manually from the database
                await query(connection, deleteSql, 11); // Assuming the ID to delete is 11
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get City by ID (GET)", () => {
        it("should retrieve a city by ID from the database", async () => {
            try {
                // Attempt to get the city with ID 11
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
});

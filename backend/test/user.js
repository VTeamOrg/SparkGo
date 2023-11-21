const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const usersModel = require("../../backend/testmodels/usertest.js"); // Import your model
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

    describe("Create User (POST)", () => {
        it("should manually insert a user into the database", async () => {
            try {
                // Insert a user manually into the database
                await usersModel.createUser(
                    "admin",
                    "testuser@example.com",
                    "testuser",
                    "12345",
                    "Test Address",
                    "123456789"
                );
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get User by ID (GET)", () => {
        it("should retrieve a user by ID from the database", async () => {
            try {
                // Attempt to get the user with ID 11
                const user = await usersModel.getUserById(11);
                // Log or assert based on the received user data
                console.log(user);
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Update User by ID (PUT)", () => {
        it("should manually update a user by ID in the database", async () => {
            try {
                // Update a user manually in the database
                const updatedUser = await usersModel.updateUser(
                    11,
                    "user",
                    "updated@example.com",
                    "Updated Name",
                    "54321",
                    "Updated Address",
                    "987654321"
                );
                // Log or assert based on the updated user data
                console.log(updatedUser);
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Delete User by ID (DELETE)", () => {
        it("should manually delete a user by ID from the database", async () => {
            try {
                // Delete a user manually from the database
                const result = await usersModel.deleteUser(11);
                // Log or assert based on the result
                console.log(result);
            } catch (error) {
                throw error;
            }
        });
    });
});

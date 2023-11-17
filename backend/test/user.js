const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../backend/app.js");
const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

const mysql = require("mysql");
const usersModel = require("../../backend/models/users.js"); // Import your model

// Define the MySQL pool configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
});

// Open a database connection
const openDb = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
};

// Close the database connection
const closeDb = (connection) => {
    return new Promise((resolve, reject) => {
        connection.release();
        resolve();
    });
};

// Execute a query on the database
const query = (connection, sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

describe("User API with MySQL", () => {
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

    describe("Create User (POST)", () => {
        it("should manually insert a user into the database", async () => {
            const insertSql = "INSERT INTO member (name, email) VALUES (?, ?)";
            const insertParams = ["testuser", "testuser@example.com"];

            try {
                // Insert a user manually into the database
                await query(connection, insertSql, insertParams);
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get User by ID (GET)", () => {
        it("should retrieve a user by ID from the database", async () => {
            try {
                // Attempt to get the user with ID 11
                const req = { params: { userId: 11 } }; // Mock request object with userId 11
                const res = {
                    json: (data) => {
                        console.log(data); // Log the received data for testing purposes
                    },
                    status: (statusCode) => {
                        return { json: (error) => console.log(error) };
                    },
                };
                await usersModel.getUserById(req, res);
                // Perform assertions based on the received data
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Update User by ID (PUT)", () => {
        it("should manually update a user by ID in the database", async () => {
            const updateSql = "UPDATE member SET name = ? WHERE id = ?";
            const updateParams = ["New Name", 11]; // Assuming the ID to update is 11

            try {
                // Update a user manually in the database
                await query(connection, updateSql, updateParams);
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Delete User by ID (DELETE)", () => {
        it("should manually delete a user by ID from the database", async () => {
            const deleteSql = "DELETE FROM member WHERE id = ?";

            try {
                // Delete a user manually from the database
                await query(connection, deleteSql, 11); // Assuming the ID to delete is 11
            } catch (error) {
                throw error;
            }
        });
    });

    describe("Get User by ID (GET)", () => {
        it("should retrieve a user by ID from the database", async () => {
            try {
                // Attempt to get the user with ID 11
                const req = { params: { userId: 11 } }; // Mock request object with userId 11
                const res = {
                    json: (data) => {
                        console.log(data); // Log the received data for testing purposes
                    },
                    status: (statusCode) => {
                        return { json: (error) => console.log(error) };
                    },
                };
                await usersModel.getUserById(req, res);
                // Perform assertions based on the received data
            } catch (error) {
                throw error;
            }
        });
    });
});

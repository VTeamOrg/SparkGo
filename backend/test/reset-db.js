const mysql = require("mysql");
const fs = require("fs").promises;
const { expect } = require("chai");
const usersModel = require("../../backend/models/users.js"); // Import your model

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const executeSQLQueries = async (queries) => {
    for (const query of queries) {
        try {
            await executeSQL(query);
        } catch (error) {
            console.error("Error executing query:", error);
        }
    }
};

const executeSQL = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

const runSQLScript = async (scriptPath) => {
    try {
        const sql = await fs.readFile(scriptPath, "utf8");
        const queries = sql.split(";").filter((query) => query.trim() !== "");
        await executeSQLQueries(queries);
    } catch (error) {
        console.error("Error reading script file:", error);
    }
};

describe("Database Tests", () => {
    before(async () => {
        // Reset the test database before tests start
        try {
            await runSQLScript("../../sql/reset test.sql");
            await runSQLScript("../../sql/insert test.sql");
        } catch (error) {
            throw error;
        }
    });

    after(() => {
        // Close the database connection after tests are done
        connection.end();
    });

    it("should perform some test on the database", async () => {
        try {
            // Run additional SQL scripts or perform database queries here
            await runSQLScript("../sql/reset test.sql");
            await runSQLScript("../../sql/insert test.sql");

            // Perform database queries and assertions here
            const queryResults = await someDatabaseQueryFunction();
            expect(queryResults).to.be.an("array");
            expect(queryResults.length).to.equal(3);
        } catch (error) {
            throw error;
        }
    });

    // Add more test cases as needed
});

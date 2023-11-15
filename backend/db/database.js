const mysql = require("mysql");
const config = require("../config/test.json");

// Create a pool to handle multiple connections
const pool = mysql.createPool(config);

// Function to open a database connection
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

// Function to close a database connection
const closeDb = (connection) => {
    return new Promise((resolve, reject) => {
        connection.release();
        resolve();
    });
};

// Function to execute a SQL query
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

module.exports = {
    openDb,
    closeDb,
    query,
};

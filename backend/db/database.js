const mysql = require("mysql");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
});

const openDb = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Error while opening database connection:", err);
                reject(new Error("Database connection failed"));
            } else {
                resolve(connection);
            }
        });
    });
};

const closeDb = (connection) => {
    return new Promise((resolve) => {
        connection.release();
        resolve();
    });
};

const query = (connection, sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) {
                console.error("Error while executing database query:", err);
                reject(new Error("Database query failed"));
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
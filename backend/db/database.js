const mysql = require("mysql");

const pool = mysql.createPool({
    host: 'localhost',
    user: 'dbadm',
    password: 'P@ssw0rd',
    database: 'sparkgo',
    multipleStatements: true,
});

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

const closeDb = (connection) => {
    return new Promise((resolve, reject) => {
        connection.release();
        resolve();
    });
};

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

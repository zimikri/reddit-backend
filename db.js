'use strict';

const mysql = require('mysql');

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
});

conn.connect((err) => {
    if (err) {
        console.error('Unable to connect to DB:', err);
        return;
    }
    console.log('Successfully connected to DB.');
});

const dbError = (err, code=0, message = '') => {
    err.clientMessage = message || 'Error during DB query';
    err.resCode = code || 500;
    console.error(`${err.clientMessage}: `, err);

    return err;
};

module.exports.db = conn;
module.exports.dbError = dbError;
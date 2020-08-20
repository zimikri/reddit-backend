'use strict';

const {db, dbError} = require('../db');

let User = function () { };

User.list = function (id, username, callback) {
    username = username || '';
    const cond = [];
    const condValues = [];

    let query = `SELECT * FROM user`;
    if (id) {
        cond.push(`id = ?`);
        condValues.push(id);
    }
    if (username) {
        cond.push(`username = ?`);
        condValues.push(username);
    }
    if (cond.length) query += ` WHERE ${cond.join(' AND ')}`;
        
    db.query(query, condValues, (err, users) => {
        if (err) {
            callback(dbError(err), null);
            return;
        }
        if ((id || username) && users) return callback(null, users[0]);

        callback(null, users);
    });
};

User.add = function (username, callback) {
    if (!username) {
        callback({ resCode: 400, clientMessage: 'Empty username' }, null);
        return
    }
    
    const query = `INSERT IGNORE INTO user SET ?`;
    db.query(query, [username], (err, result) => {
        if (err) {
            callback(dbError(err), null);
            return;
        }
        // TODO: handle if user existed before
        callback(null, result.insertId);
    });
}

User.getUserByUsername = (username, callback) => {
    if (!username)
        return callback({
            resCode: 401,
            clientMessage: 'You should send username in header to use this resource!',
        }, null);

    const query = `SELECT * FROM user WHERE username = ?`;
    db.query(query, [username], (err, user) => {
        if (err) {
            callback(dbError(err), null);
            return;
        }
        if (!user[0]) {
            callback(dbError({}, 401, `There is no registered user with usename: ${username}`), null);
            return;
        }
        
        return callback(null, user[0]);
    });
};

module.exports = User;
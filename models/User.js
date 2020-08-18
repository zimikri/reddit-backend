'use strict';

const db = require('../db');

let User = function (user) {
    
    // if (user.id) User.id = user.id;
    // User.username = user.username;

    // if (!user.id || !user.username)
    //     user = User.list(user.id, user.username, (err, user) => {
    //         if (err) {
    //             return;
    //         }
    //         if (user) {
    //             User.id = user.id;
    //             User.username = user.username;
    //         }
    //     });
    
    // return User;
};

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
            callback(User.setClientDbError(err), null);
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
            callback(User.setClientDbError(err), null);
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
            callback(User.setClientDbError(err), null);
            return;
        }
        if (!user[0]) {
            callback(User.setClientDbError({}, 401, `There is no registered user with usename: ${username}`), null);
            return;
        }
        
        return callback(null, user[0]);
    });
};

User.setClientDbError = (err, code = 0, message = '') => {
    err.clientMessage = message || 'Error during DB query';
    err.resCode = code || 500;
    console.error(`${err.clientMessage}: `, err);

    return err;
};

module.exports = User;
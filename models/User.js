'use strict';

const {db, dbError} = require('../db');

let User = function () { };

User.list = function (id, username, callback) {
    username = username || '';
    const cond = [];
    const condValues = [];

    let query = `SELECT * FROM users`;
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

        callback(null, users);
    });
};

User.add = function (username, callback) {
    if (!username) {
        callback({ resCode: 400, clientMessage: 'Empty username' }, null);
        return
    }

    User.exists(0, username, (err, user) => {
        if (err)
            return callback(err, null);

        if (!user) {
            const query = `INSERT IGNORE INTO users SET username = ?`;
            db.query(query, [username], (err, result) => {
                if (err)
                    return callback(dbError(err), null);
        
                callback(null, {
                    id: result.insertId,
                    username: username,
                });
            });
        } else {
            return callback(null, user);
        }
    });
}

User.validate = (username, callback) => {
    if (!username)
        return callback({
            resCode: 401,
            clientMessage: 'You should send username in header to use this resource!',
        }, null);

    User.exists(0, username, (err, user) => {
        if (err)
            return callback(err, null);

        if (!user) {
            User.add(username, (err, newUser) => {
                if (err)
                    return callback(err, null);
                
                return callback(null, newUser);
            });
        } else {
            return callback(null, user);
        }
    });
};

User.exists = (id, username, callback) => {
    if (!id && !username)
        return callback({
            adminMesage: 'Empty id and username in User.exists check',
            resCode: 500,
            clientMessage: 'Something went wrong',
        }, null);

        User.list(id, username, (err, users) => {
            if (err)
                return callback(err, null);
    
            if (users.length == 0)
                return callback(null, null);
    
            return callback(null, users[0]);
        });
}

module.exports = User;
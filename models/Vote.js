'use strict';

const db = require('../db');

const Vote = (postId, userId) => {
    Vote.post_id = postId;
    Vote.user_id = userId;
};

Vote.item = (postId, userId, callback) => {
    const query = 'SELECT * FROM vote WHERE post_id = ? AND user_id = ?';
    db.query(query, [postId, userId], (err, vote) => {
        if (err) {
            console.error('Error during DB query:', err);
            err.clientMessage = 'Error during DB query';
            return callback(err, null);
        }

        return callback(null, vote[0]);
    });
};

Vote.add = (postId, userId, voteValue, callback) => {
    const query = `
        INSERT INTO vote (post_id, user_id, vote) 
        VALUES(?, ?, ?)
        ON DUPLICATE KEY UPDATE vote = vote + VALUES(vote)
    `;

    db.query(query, [postId, userId, voteValue], (err, result) => {
        if (err) {
            console.error('Error during DB query:', err);

            err.resCode = 500;
            err.clientMessage = 'Error during DB query';
            return callback(err, 0);
        }

        return callback(null, voteValue);
    });
};

module.exports = Vote;
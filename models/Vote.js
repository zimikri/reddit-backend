'use strict';

const {db, dbError} = require('../db');
const Vote = () => { };

Vote.add = (postId, userId, voteValue, callback) => {
    const query = `
        INSERT INTO vote (post_id, user_id, vote) 
        VALUES(?, ?, ?)
        ON DUPLICATE KEY UPDATE vote = vote + VALUES(vote)
    `;

    db.query(query, [postId, userId, voteValue], (err, result) => {
        if (err)
            return callback(dbError(err, 500, `Error during DB query`), 0);

        return callback(null, voteValue);
    });
};

module.exports = Vote;
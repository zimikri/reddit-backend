'use strict';

const db = require('../db');
const Vote = require('./Vote');

let Post = function (post) { };

Post.list = function (username, callback) {
    const query = `
        SELECT p.id, p.title, p.url, p.timestamp, p.score, owner.username AS owner, IFNULL(uv.vote, 0) AS vote
        FROM post p
        LEFT JOIN user AS owner ON (owner.id = p.user_id)
        LEFT JOIN vote uv ON (uv.post_id = p.id)
        LEFT JOIN user u ON (u.id = uv.user_id AND u.username = ?)
        ORDER BY p.id ASC
    `;

    db.query(query, [username], (err, posts) => {
        if (err) {
            callback(Post.setClientDbError(err), null);
            return;
        }

        callback(null, posts);
    });
};

Post.item = (postId, username, callback) => {
    const query = `
        SELECT p.id, p.title, p.url, p.timestamp, p.score, owner.username AS owner, IFNULL(uv.vote, 0) AS vote
        FROM post p
        LEFT JOIN user AS owner ON (owner.id = p.user_id)
        LEFT JOIN vote uv ON (uv.post_id = p.id)
        LEFT JOIN user u ON (u.id = uv.user_id AND u.username = ?)
        WHERE p.id = ?
    `;

    db.query(query, [username, postId], (err, posts) => {
        if (err) {
            callback(Post.setClientDbError(err), null);
            return;
        }
        if (!posts[0]) {
            callback(Post.setClientDbError({}, 400, `Can't find the post`), null);
            return;
        }

        callback(null, posts[0]);
    });
};

Post.vote = (postId, vote, callback) => {
    const query = `UPDATE post SET score = score + ? WHERE id = ?`;
    db.query(query, [vote, postId], (err, result) => {
        if (err) {
            callback(Post.setClientDbError(err), null);
            return;
        }
            
        callback(null, result.changedRows);
    });
};

Post.add = (post, userId, callback) => {
    let query = `INSERT INTO post SET timestamp=UNIX_TIMESTAMP(), ?`;
    if (userId) post.user_id = userId;

    db.query(query, post, (err, result) => {
        if (err) {
            callback(Post.setClientDbError(err), null);
            return;
        }
        
        callback(null, result.insertId);
    });
};

Post.update = (id, title, url, callback) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const query = 'UPDATE post SET title = ?, url = ?, timestamp = ? WHERE id = ?';
    db.query(query, [title, url, timestamp, id], (err, result) => {
        if (err) {
            callback(Post.setClientDbError(err), null);
            return;
        }

        return callback(null, timestamp);
    });
};

Post.delete = (id, callback) => {
    const query = 'DELETE FROM post WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            callback(
                Post.setClientDbError(err, 0, 'Error during post delete'),
                null
            );
            return;
        }

        return callback(null, result.affectedRows);
    });
};

Post.setClientDbError = (err, code=0, message = '') => {
    err.clientMessage = message || 'Error during DB query';
    err.resCode = code || 500;
    console.error(`${err.clientMessage}: `, err);

    return err;
};

module.exports = Post;
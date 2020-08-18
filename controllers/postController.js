'use strict';

const Post = require('../models/Post');
const User = require('../models/User');
const Vote = require('../models/Vote');

const postController = function(app) {
    app.get('/posts', (req, res) => {
        
        if (req.query.id)
            return res.redirect(`/posts/${req.query.id}`);

        Post.list(req.headers.username, (err, posts) => {
            if (err) 
                return res.status(err.resCode).json({ error: err.clientMessage });
            
            res.json({
                posts: posts,
            });
        });
    });

    app.get('/posts/:id', (req, res) => {
        Post.item(req.params.id, req.headers.username, (err, post) => {
            if (err) 
                return res.status(err.resCode).json({ error: err.clientMessage });
            
            res.json(post);
        });
    });

    app.post('/posts', (req, res) => {
        User.getUserByUsername(req.headers.username, (err, user) => {
            if (err)
                return res.status(err.resCode).json({ error: err.clientMessage });

            Post.add(req.body, user.id, (err, newId) => {
                if (err) 
                    return res.status(err.resCode).json({ error: err.clientMessage });
            
                res.redirect(`/posts/${newId}`);
            });
        });
    });

    app.put('/posts/:id/:vote', (req, res) => {
        const vote = (req.params.vote == 'upvote') * 1 + (req.params.vote == 'downvote') * -1;
        if (vote == 0)
            return res.status(404).json({ error: 'No such resurce' });

        User.getUserByUsername(req.headers.username, (err, user) => {
            if (err)
                return res.status(err.resCode).json({ error: err.clientMessage });
 
            Post.item(req.params.id, user.username, (err, post) => {
                if (err)
                    return res.status(err.resCode).json({ error: err.clientMessage });

                if (post.owner == user.username)
                    return callback({
                        resCode: 403,
                        clientMessage: `Can't vote your own post`,
                    });

                if (post.vote + vote < -1 || post.vote + vote > 1)
                    return res.status(400).json({ error: `You can't ${req.params.vote} again` });
                    
                Vote.add(post.id, user.id, vote, (err, voteValue) => {
                    if (err)
                        return res.status(err.resCode).json({ error: err.clientMessage });
                    
                    Post.vote(post.id, voteValue, (err, result) => {
                        if (err)
                            return res.status(err.resCode).json({ error: err.clientMessage });
                        
                        return res.redirect(`/posts/${post.id}`);
                    });
                });
            });
        });
    });

    app.put('/posts/:id', (req, res) => {
        User.getUserByUsername(req.headers.username, (err, user) => {
            if (err) return res.status(err.resCode).json({ error: err.clientMessage });
            
            Post.item(req.params.id, req.headers.username, (err, post) => {
                if (err) 
                    return res.status(err.resCode).json({ error: err.clientMessage });
                if (post.owner !== req.headers.username)
                    return res.status(403).json({ error: `You can only update your own posts` });

                Post.update(req.params.id, req.body.title, req.body.url, (err, timestamp) => {
                    if (err) 
                        return res.status(err.resCode).json({ error: err.clientMessage });
                    
                    res.redirect(`/posts/${post.id}`);
                });
            });
        });
     });

    app.delete('/posts/:id', (req, res) => {
        User.getUserByUsername(req.headers.username, (err, user) => {
            if (err) return res.status(err.resCode).json({ error: err.clientMessage });

            Post.item(req.params.id, user.username, (err, post) => {
                if (err) 
                    return res.status(err.resCode).json({ error: err.clientMessage });
                if (post.owner !== user.username)
                    return res.status(403).json({ error: `You can delete only your own posts` });
            
                Post.delete(req.params.id, (err, result) => {
                    if (err) 
                        return res.status(err.resCode).json({ error: err.clientMessage });
                    
                    res.json(post);
                });
            });
        });
    });
};

module.exports.postController = postController;
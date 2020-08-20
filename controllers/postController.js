'use strict';

const Post = require('../models/Post');
const User = require('../models/User');
const Vote = require('../models/Vote');

const postController = function(app) {
    app.get('/posts', (req, res) => {
        if (req.query.id) {
            sendPost(req, res, req.query.id);
            return;
        }

        Post.list(req.headers.username, (err, posts) => {
            if (err) 
                return res.status(err.resCode).json({ error: err.clientMessage });
            
            res.json({
                posts: posts,
            });
        });
    });

    app.get('/posts/:id', (req, res) => {
        sendPost(req, res, req.params.id);
    });

    app.post('/posts', (req, res) => {
        const postValidMessage = postValidator(req.body);
        if (postValidMessage) return res.status(400).json({ error: postValidMessage });

        User.validate(req.headers.username, (err, user) => {
            if (err)
                return res.status(err.resCode).json({ error: err.clientMessage });

            Post.add(req.body, user.id, (err, newId) => {
                if (err) 
                    return res.status(err.resCode).json({ error: err.clientMessage });
            
                sendPost(req, res, newId);
            });
        });
    });

    app.put('/posts/:id/upvote', (req, res) => {
        votePost(req, res, 1);
    });

    app.put('/posts/:id/downvote', (req, res) => {
        votePost(req, res, -1);
    });

    app.put('/posts/:id', (req, res) => {
        User.validate(req.headers.username, (err, user) => {
            if (err) return res.status(err.resCode).json({ error: err.clientMessage });
            
            Post.item(req.params.id, req.headers.username, (err, post) => {
                if (err) 
                    return res.status(err.resCode).json({ error: err.clientMessage });

                if (post.owner !== req.headers.username)
                    return res.status(403).json({ error: `You can only update your own posts` });

                Post.update(req.params.id, req.body.title, req.body.url, (err) => {
                    if (err) 
                        return res.status(err.resCode).json({ error: err.clientMessage });
                    
                    sendPost(req, res, post.id);
                });
            });
        });
     });

    app.delete('/posts/:id', (req, res) => {
        User.validate(req.headers.username, (err, user) => {
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

    const votePost = (req, res, vote) => {
        const noteType = vote == 1 ? 'upvote' : 'downvote';
        User.validate(req.headers.username, (err, user) => {
            if (err)
                return res.status(err.resCode).json({ error: err.clientMessage });
 
            Post.item(req.params.id, user.username, (err, post) => {
                if (err)
                    return res.status(err.resCode).json({ error: err.clientMessage });

                if (post.owner && post.owner == user.username)
                    return res.status(403).json({ error: `Can't vote your own post` });

                if (post.vote + vote < -1 || post.vote + vote > 1)
                    return res.status(400).json({ error: `You can't ${noteType} again` });
                    
                Vote.add(post.id, user.id, vote, (err, voteValue) => {
                    if (err)
                        return res.status(err.resCode).json({ error: err.clientMessage });
                    
                    Post.vote(post.id, voteValue, (err, result) => {
                        if (err)
                            return res.status(err.resCode).json({ error: err.clientMessage });
                        
                        sendPost(req, res, post.id);
                    });
                });
            });
        });
    }

    const sendPost = (req, res, postId) => {
        Post.item(postId, req.headers.username, (err, post) => {
            if (err) 
                return res.status(err.resCode).json({ error: err.clientMessage });
            
            res.json(post);
        });
    }

    const postValidator = (post) => {
        if (!post.title) return `You can't add post with empty title`;
        if (!post.url) return `You can't add post with empty url`;
        if (post.url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm) === null) return 'Misformatted url';
        return '';
    }
};

module.exports.postController = postController;
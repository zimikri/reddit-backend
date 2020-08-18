'use strict';

const express = require('express');
const controller = require('./controllers/postController');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json()); 

controller.postController(app);

app.listen(3000, 'localhost', () => {
    console.log("The app is listening on port 3000...");
});
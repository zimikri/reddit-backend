'use strict';

const express = require('express');
const controller = require('./controllers/postController');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.static('public'));

controller.postController(app);

app.listen(PORT, () => {
    console.log(`The app is listening on port ${PORT}...`);
});
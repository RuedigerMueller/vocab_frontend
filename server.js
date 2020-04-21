// server.js - required to launch on Heroku; make sure that npm install express is executed :-)
const express = require('express');
const path = require('path');

const app = express();

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist/frontend'));

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
});
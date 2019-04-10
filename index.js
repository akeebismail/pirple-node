/*
 * Primary file for API
 *
 */

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/worker');

var app = {};
app.innit = function () {
    //Start the server
    server.init();

    // Start the workers
    workers.init();

};

// Self executing
app.innit();

module.exports = app;
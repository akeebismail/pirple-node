
var http = require('http');
var https = require('https');
var fs = require('fs');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

//Instantiate the hTTP server

var  httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});
// Start the HTTP server
httpServer.listen(config.httpPort, function () {
    console.log('The HTTP server is running on port ' + config.httpPort);
});

// Instantiate the HTTPS server
var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res)
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
    console.log('The HTTPS server is running on port ' + config.httpsPort)
});
var unifiedServer = function(req, res){
    //Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);
    //Get the path
    var path = parsedUrl.pathname.replace(/^\/+|\/+$/g,'');
    var qString = parsedUrl.query;
    var method = req.method.toLowerCase();
    var headers  = req.headers;

    var decoder = new StringDecoder('utf-8');
    var  buffer ='';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end',function () {
        buffer += decoder.end();

        //chose the handler to go to
        var choosenHandler = typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;

        //construct the data obj to send the handler

        var data = {
            'trimmedPath' : path,
            'qString' : qString,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        choosenHandler(data, function (statusCode, payload) {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            payload = typeof(payload) === 'object' ? payload : {};

            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log(payloadString )
        });

    });
};


var handlers = {};

// Ping hanglers
handlers.ping = function(data, callback){
    callback(200);
};

handlers.notFound = function (data, callback) {
    callback(404);
};

var  router = {
    'sample' : handlers.sample
}
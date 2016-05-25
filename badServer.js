// Dependencies
var http = require('http'),
    fs = require('fs'),
    myFS = require('./fs'),
    parser = require('./parser'),
    myHttp = require('./http'),
    logging = require('./logging'),
    routing = require('./routing');

// Dependency injection
myFS.fs = fs;
myFS.stringifyPerson = parser.stringifyPerson;

routing.parser = parser;
routing.myFS = myFS;
routing.myHttp = myHttp;

var cache = {};

routing.cache = cache;

// Server
http.createServer(function (req, res) {

    var cookies = parser.parseCookie(req.headers.cookie);
    logging.logRequest(req);
    routing.route(req, res, cookies);

}).listen(8800);

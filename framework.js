// Dependencies
var http = require('http'),
    fs = require('fs'),
    myFS = require('./fs'),
    parser = require('./parser'),
    myHttp = require('./http'),
    logging = require('./logging'),
    routing = require('./routing'),
    server = require('./badServer.js');

// Dependency injection
myFS.fs = fs;
myFS.stringifyPerson = parser.stringifyPerson;

routing.parser = parser;
routing.myFS = myFS;
routing.myHttp = myHttp;
routing.cache = server.cache;

server.parser = parser;
server.logging = logging;
server.routing = routing;

// Running server
http.createServer(server.getServer).listen(8800);
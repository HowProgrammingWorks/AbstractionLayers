var cookies = require('./cookies');
var http = require('http');
var	logger = require('./logger');
var router = require("./router");
var  fs = require('fs');
var cache = {};

exports.cache = cache;
exports.start = function(config) {
  http.createServer(function onRequest(request, response) {
    var thecookies = cookies.parseCookies(request.headers.cookie);
    logger.logging(request);
	router.route(request, response, thecookies);
  }).listen(config.port, config.host);
}


        
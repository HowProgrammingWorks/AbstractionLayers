var http = require('http'),
    cookie = require('./cookie'),
	logging = require('./logging'),
	route = require('./route');


var cache = {};
exports.cache = cache;

http.createServer(function onRequest(request, response) {

    var cookies = cookie.parsingOfCookies(request.headers.cookie);
    logging.log(request);
    route.startRouting(request, response, cookies);

}).listen(80);

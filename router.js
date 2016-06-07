var handler = require("./handler");
var server = require("./server");

var routing = {
    'GET/' : function(req,res,cookies) {
		handler.get(req,res,cookies);
		return true;
		},
    'GET/person' : function(req,res) {
		handler.getPerson(req,res);
		return true;
		},
    'POST/person' : function(req, res) {
        handler.post(req,res);
		return true;
    },
    'cached' : function(res, data) {
		res.writeHead(200);
		res.end(data);
		return true;
    },
    'default' : function(res) {
        res.writeHead(404);
		res.end('Not found');
		return true;
    }
}

exports.routing = routing;

exports.route = function(req, res, cookies) {
    var metaUrl = req.method + req.url;
    return server.cache[metaUrl] && routing['cached'](res, cache[metaUrl])
     || routing[metaUrl] && routing[metaUrl](req, res, cookies)
     || routing['default'](res);
} 

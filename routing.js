module.exports = {};

var routing = {
    'GET/' : function(req, res, cookies) {
        res.writeHead(200, {
            'Set-Cookie': 'mycookie=test',
            'Content-Type': 'text/html'
        });
        var ip = req.connection.remoteAddress;
        res.write(module.exports.parser.strReplace('<h1>Welcome</h1>Your IP: %%', [ip]));
        res.end(module.exports.parser.strReplace('<pre>%%</pre>', [JSON.stringify(cookies)]));
        return true;
    },
    'GET/person' : function(req, res) {
        module.exports.myFS.getPerson(function(data){
            module.exports.myHttp.sendResponse(res, data ? 200 : 500, data ? data : 'Read error');
        });
        return true;
    },
    'POST/person' : function(req, res) {
        module.exports.myHttp.concatBuffer(req, function(data) {
            data = module.exports.parser.parsePerson(data);
            cache[req.url] = data;
            module.exports.myFS.setPerson(data, req, function(success) {
                module.exports.myHttp.sendResponse(res, success ? 200 : 500, success ? 'File saved' : 'Write error');
            });
        });
        return true;
    },
    'cached' : function(res, data) {
        module.exports.myHttp.sendResponse(res, 200, data);
        return true;
    },
    'default' : function(res) {
        module.exports.myHttp.sendResponse(res, 404, 'Path not found');
        return true;
    }
}

module.exports.routing = routing;

module.exports.route = function(req, res, cookies) {
    var metaUrl = req.method + req.url;
    return module.exports.cache[metaUrl] && routing['cached'](res, cache[metaUrl])
     || routing[metaUrl] && routing[metaUrl](req, res, cookies)
     || routing['default'](res);
}
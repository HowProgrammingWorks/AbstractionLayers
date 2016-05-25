module.exports = {};

var cache = {};

var getServer = function (req, res) {

    var cookies = module.exports.parser.parseCookie(req.headers.cookie);
    module.exports.logging.logRequest(req);
    module.exports.routing.route(req, res, cookies);

};

module.exports.cache = cache;
module.exports.getServer = getServer;
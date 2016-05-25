module.exports = {};

module.exports.concatBuffer = function(req, callback) {
    var body = [];
    req.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        var data = Buffer.concat(body).toString();
        callback(data);
    });
}

module.exports.sendResponse = function(res, status, result) {
    res.writeHead(status);
    res.end(result);
}
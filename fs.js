module.exports = {};

module.exports.getPerson = function(callback) {
    module.exports.fs.readFile('./person.json', function(err, data) {
        if (!err) {
            callback(module.exports.stringifyPerson(JSON.parse(data)));
        } else {
            callback(null);
        }
    });
}

module.exports.setPerson = function(data, req, callback) {
    module.exports.fs.writeFile('./person.json', data, function(err) {
        if (!err) {
            callback(true);
        } else {
            callback(false);
        }
    });
}
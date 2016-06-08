
var http = require('http'),
    fs = require('fs');

var cache = {};

exports.post = function(req, res) {
        var body = [];
        req.on('data', function(chunk) {
          body.push(chunk);
        }).on('end', function() {
          var data = Buffer.concat(body).toString();
          var obj = JSON.parse(data);
          if (obj.name) obj.name = obj.name.trim();
          data = JSON.stringify(obj);
          cache[req.url] = data;
          fs.writeFile('./person.json', data, function(err) {
            if (!err) {
              res.writeHead(200);
              res.end('File saved');
            } else {
              res.writeHead(500);
              res.end('Write error');
            }
          });
        });
		
}
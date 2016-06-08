var fs = require('fs');


var cache = {};

exports.get = function(req, res) {


        fs.readFile('./person.json', function(err, data) {
          if (!err) {
            var obj = JSON.parse(data);
            obj.birth = new Date(obj.birth);
            var difference = new Date() - obj.birth;
            obj.age = Math.floor(difference / 31536000000);
            delete obj.birth;
            var data = JSON.stringify(obj);
            cache[req.url] = data;

           
            res.writeHead(200);
            res.end(data);
          } else {
            res.writeHead(500);
            res.end('Read error');
          }
        });
		
}
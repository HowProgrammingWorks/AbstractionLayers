var  fs = require('fs');
var server = require("./server");

exports.get = function(req, res, cookies){ 
        res.writeHead(200, {
          'Set-Cookie': 'mycookie=test',
          'Content-Type': 'text/html'
        });
        var ip = req.connection.remoteAddress;
		
		var body = '<pre>Your IP: ' + ip+'</pre>'+
		'<pre>' + JSON.stringify(cookies)+'</pre>';
		
        res.write(body);
        res.end();
}

exports.getPerson = function(req, res){	
        fs.readFile('./person.json', function(err, data) {
          if (!err) {
            var obj = JSON.parse(data);
            obj.birth = new Date(obj.birth);
            var difference = new Date() - obj.birth;
            obj.age = Math.floor(difference / 31536000000);
            delete obj.birth;
			
			var data = JSON.stringify(obj);
			
            server.cache[req.url] = JSON.stringify(obj);

            res.writeHead(200);
            res.end(data);
          } else {
            res.writeHead(500);
            res.end('Read error');
          }
        });
}

exports.post = function(req, res){ 
        var body = [];
        req.on('data', function(chunk) {
          body.push(chunk);
        }).on('end', function() {
          var data = Buffer.concat(body).toString();
          var obj = JSON.parse(data);
          if (obj.name) obj.name = obj.name.trim();
          data = JSON.stringify(obj);
          server.cache[req.url] = data;
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





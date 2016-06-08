 var person = require('./person'),
	   badServer = require('./badServer');
 

exports.startRouting = function(req,res,cookies) {
 
 // Serve from cache
  if (badServer.cache[req.url] && req.method === 'GET') {
    res.writeHead(200);
    res.end(badServer.cache[req.url]);
  } else {

    // Routing
    if (req.url === '/') {
      if (req.method === 'GET') {
        res.writeHead(200, {
          'Set-Cookie': 'mycookie=test',
          'Content-Type': 'text/html'
        });
        var ip = req.connection.remoteAddress;
        res.write('<h1>Welcome</h1>Your IP: ' + ip);
        res.end('<pre>' + JSON.stringify(cookies) + '</pre>');
      }
    } else if (req.url === '/person') {
     person.execute(req, res);
    } else {
      res.writeHead(404);
      res.end('Path not found');
    }
  }
  
}
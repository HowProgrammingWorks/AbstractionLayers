'use strict';

// Dependencies
global.api = {};
api.http = require('http');
api.fs = require('fs');

// Cache
let cache = {};

// HTTP Server
api.http.createServer((req, res) => {

  // Parse cookies
  let cookie = req.headers.cookie,
      cookies = {};
  if (cookie) cookie.split(';').forEach((item) => {
    let parts = item.split('=');
    cookies[(parts[0]).trim()] = (parts[1] || '').trim();
  });

  // Logging
  let date = new Date().toISOString();
  console.log([date, req.method, req.url].join('  '));

  // Serve from cache
  if (cache[req.url] && req.method === 'GET') {
    res.writeHead(200);
    res.end(cache[req.url]);
  } else {

    // Routing
    if (req.url === '/') {
      if (req.method === 'GET') {
        res.writeHead(200, {
          'Set-Cookie': 'mycookie=test',
          'Content-Type': 'text/html'
        });
        let ip = req.connection.remoteAddress;
        res.write('<h1>Welcome</h1>Your IP: ' + ip);
        res.end('<pre>' + JSON.stringify(cookies) + '</pre>');
      }
    } else if (req.url === '/person') {
      if (req.method === 'GET') {

        // Some business logic
        api.fs.readFile('./person.json', (err, data) => {
          if (!err) {
            let obj = JSON.parse(data);
            obj.birth = new Date(obj.birth);
            let difference = new Date() - obj.birth;
            obj.age = Math.floor(difference / 31536000000);
            delete obj.birth;
            let data = JSON.stringify(obj);
            cache[req.url] = data;

            // HTTP reply
            res.writeHead(200);
            res.end(data);
          } else {
            res.writeHead(500);
            res.end('Read error');
          }
        });

      } else if (req.method === 'POST') {

        // Receiving POST data
        let body = [];
        req.on('data', (chunk) => {
          body.push(chunk);
        }).on('end', () => {
          let data = Buffer.concat(body).toString();
          let obj = JSON.parse(data);
          if (obj.name) obj.name = obj.name.trim();
          data = JSON.stringify(obj);
          cache[req.url] = data;
          api.fs.writeFile('./person.json', data, (err) => {
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
    } else {
      res.writeHead(404);
      res.end('Path not found');
    }
  }

}).listen(80);

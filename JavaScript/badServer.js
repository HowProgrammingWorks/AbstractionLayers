'use strict';

// Dependencies
const http = require('http');
const fs = require('fs');

// Cache
const cache = {};

// HTTP Server
http.createServer((req, res) => {

  // Parse cookies
  const cookie = req.headers.cookie;
  const cookies = {};
  if (cookie) cookie.split(';').forEach(item => {
    const parts = item.split('=');
    cookies[(parts[0]).trim()] = (parts[1] || '').trim();
  });

  // Logging
  const date = new Date().toISOString();
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
        const ip = req.connection.remoteAddress;
        res.write(`<h1>Welcome</h1>Your IP: ${ip}`);
        res.end(`<pre>${JSON.stringify(cookies)}</pre>`);
      }
    } else if (req.url === '/person') {
      if (req.method === 'GET') {

        // Some business logic
        fs.readFile('./person.json', (err, data) => {
          if (!err) {
            const obj = JSON.parse(data);
            obj.birth = new Date(obj.birth);
            const difference = new Date() - obj.birth;
            obj.age = Math.floor(difference / 31536000000);
            delete obj.birth;
            const sobj = JSON.stringify(obj);
            cache[req.url] = sobj;

            // HTTP reply
            res.writeHead(200);
            res.end(sobj);
          } else {
            res.writeHead(500);
            res.end('Read error');
          }
        });

      } else if (req.method === 'POST') {

        // Receiving POST data
        const body = [];
        req.on('data', chunk => {
          body.push(chunk);
        }).on('end', () => {
          let data = Buffer.concat(body).toString();
          const obj = JSON.parse(data);
          if (obj.name) obj.name = obj.name.trim();
          data = JSON.stringify(obj);
          cache[req.url] = data;
          fs.writeFile('./person.json', data, err => {
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

}).listen(8000);

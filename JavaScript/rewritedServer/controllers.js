'use strict';

const { setCache } = require('./cache');
const { parseCookies } = require('./cookies');
const { personGetService, personPostService } = require('./services');

const defaultController = (req, res) => {
  const cookies = parseCookies(req);
  res.writeHead(200, {
    'Set-Cookie': 'mycookie=test',
    'Content-Type': 'text/html'
  });
  const ip = req.connection.remoteAddress;
  res.write(`<h1>Welcome</h1>Your IP: ${ip}`);
  res.end(`<pre>${JSON.stringify(cookies)}</pre>`);
}

const personGetController = async (req, res) => {
  const result = await personGetService();
  setCache(req.url, result);
  if (result) {
    res.writeHead(200);
    res.end(result);
  } else {
    res.writeHead(500);
    res.end('Read error');
  }
}

const personPostController = (req, res) => {
  const body = [];

  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', async () => {
    let data = Buffer.concat(body).toString();
    const obj = JSON.parse(data);
    data = await personPostService(obj);
    if (data) {
      res.writeHead(200);
      res.end('File saved');
    } else {
      res.writeHead(500);
      res.end('Write error');
    }
  });
}

module.exports = {
  defaultController,
  personGetController,
  personPostController
}

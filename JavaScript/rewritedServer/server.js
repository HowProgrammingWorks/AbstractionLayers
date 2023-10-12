'use strict';

const http = require('node:http');
const { PORT } = require('./config');
const routing = require('./routing');
const { logger } = require('./loger');
const { getFromCache } = require('./cache');

http.createServer((req, res) => {
  logger.log(req.method, req.url);
  if (req.method === 'GET' && getFromCache(req.url)) {
    return getFromCache(req.url);
  }
  routing[req.method][req.url](req, res);
}).listen(PORT);

'use strict';

const http = require('http');

const me = { name: 'jura', age: 22 };

const routing = {
  '/': '<h1>welcome to homepage</h1>',
  '/user': me,
  '/user/name': () => me.name,
  '/user/age': () => me.age
};

const types = {
  object: o => JSON.stringify(o),
  string: s => s,
  undefined: () => 'not found',
  function: (fn, req, res) => fn(req, res) + '',
};

http.createServer((req, res) => {
  const data = routing[req.url];
  const result = types[typeof(data)](data, req, res);
  res.end(result);
}).listen(80);

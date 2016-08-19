'use strict';

global.api = {};
api.http = require('http');

let me = { name: 'jura', age: 22 };

let routing = {
  '/': '<h1>welcome to homepage</h1>',
  '/user': me,
  '/user/name': () => me.name,
  '/user/age': () => me.age
};

let types = {
  object: o => JSON.stringify(o),
  string: s => s,
  undefined: () => 'not found',
  function: (fn, req, res) => fn(req, res) + '',
};

api.http.createServer((req, res) => {
  let data = routing[req.url],
      result = types[typeof(data)](data, req, res);
  res.end(result);
}).listen(80);

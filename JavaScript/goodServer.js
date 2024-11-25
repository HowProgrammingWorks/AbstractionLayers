'use strict';

const http = require('node:http');

const PORT = 8000;

const me = { name: 'jura', age: 22 };

const routing = {
  '/': '<h1>welcome to homepage</h1>',
  '/user': me,
  '/user/name': () => me.name,
  '/user/age': () => me.age,
};

const types = {
  object: JSON.stringify,
  string: (s) => s,
  undefined: () => 'not found',
  function: (fn, req, res) => fn(req, res).toString(),
};

http
  .createServer((req, res) => {
    const data = routing[req.url];
    const type = typeof data;
    const serializer = types[type];
    const result = serializer(data, req, res);
    res.end(result);
  })
  .listen(PORT);

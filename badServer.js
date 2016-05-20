// Dependencies
var http = require('http'),
    fs = require('fs');

// File System
var getPerson = function(callback) {
  fs.readFile('./person.json', function(err, data) {
    if (!err) {
      callback(stringifyPerson(JSON.parse(data)));
    } else {
      callback(null);
    }
  });
}

var setPerson = function(data, req, callback) {
  fs.writeFile('./person.json', data, function(err) {
    if (!err) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

// Parsing
var parsePerson = function(data) {
  var obj = JSON.parse(data);
  if (obj.name) obj.name = obj.name.trim();
  data = JSON.stringify(obj);
  return data;
}

var stringifyPerson = function(obj) {
  if (!obj.age) {
    obj.birth = new Date(obj.birth);
    var difference = new Date() - obj.birth;
    obj.age = Math.floor(difference / 31536000000);
    delete obj.birth;
  }
  return JSON.stringify(obj);
}

var parseCookie = function(cookie) {
  var cookies = {};
  if (cookie) cookie.split(';').forEach(function(item) {
    var parts = item.split('=');
    cookies[(parts[0]).trim()] = (parts[1] || '').trim();
  });
  return cookies;
}

var strReplace = function(str, args) {
  args.forEach(function(arg){
    str = str.replace("%%", arg)
  });
  return str;
}

// HTTP
var concatBuffer = function(req, callback) {
  var body = [];
  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    var data = Buffer.concat(body).toString();
    callback(data);
  });
}

var sendResponse = function(res, status, result) {
  res.writeHead(status);
  res.end(result);
}

var routing = {
  'GET/' : function(req, res, cookies) {
    res.writeHead(200, {
      'Set-Cookie': 'mycookie=test',
      'Content-Type': 'text/html'
    });
    var ip = req.connection.remoteAddress;
    res.write(strReplace('<h1>Welcome</h1>Your IP: %%', [ip]));
    res.end(strReplace('<pre>%%</pre>', [JSON.stringify(cookies)]));
    return true;
  },
  'GET/person' : function(req, res) {
    getPerson(function(data){
      sendResponse(res, data ? 200 : 500, data ? data : 'Read error');
    });
    return true;
  },
  'POST/person' : function(req, res) {
    concatBuffer(req, function(data) {
      data = parsePerson(data);
      cache[req.url] = data;
      setPerson(data, req, function(success) {
        sendResponse(res, success ? 200 : 500, success ? 'File saved' : 'Write error');
      });
    });
    return true;
  },
  'cached' : function(res, data) {
    sendResponse(res, 200, data);
    return true;
  },
  'default' : function(res) {
    sendResponse(res, 404, 'Path not found');
    return true;
  }
}

var route = function(req, res, cookies) {
  var metaUrl = req.method + req.url;
  return cache[metaUrl] && routing['cached'](res, cache[metaUrl])
   || routing[metaUrl] && routing[metaUrl](req, res, cookies)
   || routing['default'](res);
}

var logRequest = function(req) {
  var date = new Date().toISOString();
  console.log([date, req.method, req.url].join('  '));
}

// Logging
var cache = {};

http.createServer(function (req, res) {

  var cookies = parseCookie(req.headers.cookie);
  logRequest(req);
  route(req, res, cookies);

}).listen(8800);

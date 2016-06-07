var server = require("./server");
var  fs = require('fs');
var config = require('./config.json');
console.log(config);
server.start(config);

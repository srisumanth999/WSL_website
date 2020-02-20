var http = require('http');
var dt = require('./myfirstmodule');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var q = url.parse(req.url, true).query;
  var txt = q.year + " " + q.month;
  res.write(txt);
  res.end();
}).listen(8080); 

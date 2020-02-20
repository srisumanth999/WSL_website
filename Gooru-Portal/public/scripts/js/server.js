var http = require('http');
var fs = require('fs');
var url = require('url');
var formidable = require('formidable');

http.createServer(function (req, res) {
	var path = req.url

	switch (path){
		case '/login':
			fs.readFile('./login.html', function(err, data){
				if (err) {
					res.writeHead(404, {'Content-Type': 'text/html'});
					res.write(err);
					res.end();
				} else {
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(data);
					res.end();
				}     
			});
			break;
		default:  
			res.writeHead(404, {'Content-Type': 'text/html'});  
			res.write("opps this doesn't exist - 404");  
			res.end();  
			break; 
  }
}).listen(5555);

var express = require('express');
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require("body-parser");
var formidable = require('formidable');
var myModule = require('./public/scripts/script');
var cors = require('cors');
// var csrf = require('csurf');

var connection = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "sumanth55",
	  database: "wsldb"
	});
connection.connect(function(err) {
	  if (err) throw err
	  console.log('You are now connected...');
});

var app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'data')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({origin: 'http://localhost:5555'}));
// app.use(csrf());
// app.use(function (req, res, next) {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     next();
// });

var session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

var port = 5555;
var table = 'roles';

// fs.readFile('../portal/cred.json', (err, data) => {
//     if (err) throw err;
//     var data = JSON.parse(data);
//     admin_id = data.user_details.id;
// });

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.route('/login')
    .get((req, res) => {
    	res.set('Content-Type', 'text/html')
        res.sendFile(__dirname + '/public/login.html');
    });

app.route('/admin')
    .get(myModule.isauthenticated, (req, res) => {
    	res.set('Content-Type', 'text/html')
    	// if ((req.path.indexOf('/admin') >= 0)) {
     //   		res.redirect('/login');}
		 var role = req.session.role;
		 if(role=='user')
		 {
			 res.redirect('/user');
		 }
        res.sendFile(__dirname + '/public/admin.html');
    });

app.route('/user')
	.get(myModule.isauthenticated, (req, res) => {
		// if ((req.path.indexOf('/user') >= 0)) {
  //      		res.redirect('/login');}
       	res.set('Content-Type', 'text/html')
				var role = req.session.role;
				if(role == 'admin')
				{
					res.redirect('/admin');
				}
	    res.sendFile(__dirname + '/public/user.html');
	});

app.route('/addadmin')
	.post(myModule.isauthenticated, (req, res) => {
		var email = req.body.email;
		var permission = req.body.permission;
		var q = "INSERT INTO roles (gmail, permission) VALUES (?, ?)";
		connection.query(q, [email, permission], function (err, result) {
		if (err){
			res.end(err);
		} else {
			res.end('Added');
		}
		});
	});

app.route('/removeadmin')
	.post(myModule.isauthenticated, (req, res) => {
		var email = req.body.email;
		var permission = req.body.permission;
		var q = "DELETE FROM roles WHERE gmail=? AND permission=?";
		connection.query(q, [email, permission], function (err, result) {
		if (err){
			res.end(err);
		} else {
			console.log('Removed');
			res.end("Removed");
		}
		});
	});

app.route('/resourcereactions')
	.post(myModule.isauthenticated, (req, res) => {
		var rid = req.body.rid;
		var q = "SELECT (likes, dislikes) FROM reaction_id WHERE resource_id=?";
		connection.query(q, [rid], function (err, result) {
		if (err){
			res.end(err);
		} else {
			res.end(result);
		}
		});
	});

app.route('/uploadresource')
	.post((req, res) => {
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {

			var dir = files.competency.name.split('_').slice(0,-1).join('_')
			var newdir = path.join(__dirname,'data/admin/facet', dir)
			!fs.existsSync(newdir) && fs.mkdirSync(newdir);

			var oldpathcomp = files.competency.path;
			var filepathcomp = path.join(newdir,files.competency.name);
			fs.rename(oldpathcomp, filepathcomp, function (err) {
		        if (err) {
		        	res.end(err);
		        } else {
			        res.end('Uploaded');
							var q = "INSERT INTO map_ids (description,dir) VALUES (?,?)";
							connection.query(q, [dir,newdir], function (err, result) {
							if (err){
								res.end(err);
							} else {
								console.log('New Data Inserted');
								res.end("Successful Insertion Of DATA");
							}
							});
		        }
		      });


			fs.copyFile(filepathcomp, path.join(__dirname, 'public', files.competency.name), (err) => {
			  if (err) throw err;
			  console.log('copied MAP to desired LOC');
			});




			console.log(files);
			var oldpathlpath = files.lpath.path;
			var filepathlpath = path.join(newdir,files.lpath.name);
			fs.rename(oldpathlpath, filepathlpath, function (err) {
		        if (err) {
		        	res.end(err);
		        } else {
			        res.end('Uploaded');
		        }

		      });

                       fs.copyFile(filepathlpath, path.join(__dirname, 'public', files.lpath.name), (err) => {
			  if (err) throw err;
			  console.log('copied PATH to desired LOC');
			});

		});
	});

app.route('/listadmins')
	.get((req, res) => {
		var i;
		var text = "";
		var q = "SELECT gmail FROM roles WHERE permission=?";
		connection.query(q, ["admin"], function (err, result) {
		if (err){
			res.end(err);
		} else {
			for (i = 0; i < result.length; i++) {
				text += result[i].gmail + " ";
			}
			console.log(text);
			res.end(text);
		}
		});
	});

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

app.route('/getMaps')
	.get((req, res) => {
		var i;
		var archive='';
		var txt;
		var id;
		// var basedir = path.join(__dirname, 'data/admin/facet')
		// var dirs = getDirectories(basedir);
		var q = "SELECT id,description FROM map_ids";
		connection.query(q,function (err, result) {
		if (err){
			console.log(err);
			res.end(err);
		} else {
			var i;
			var length = result.length-1;
			for(i=0;i<=length;i++){
				txt = result[i]["description"].split('_').join(' ');
				id = result[i]["id"];
				txt = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				archive += "<a href='#' id="+id+" class='' onclick='openMap(" +id+");'>"+ txt+" Competency & Path</a>END";
			}
			res.end(archive);
		}
		});
	});

	app.route('/checkrole')
		.post((req, res) => {
			var email = req.body.email;
			console.log(email);
			var q = "SELECT permission from roles WHERE gmail = ?";
			connection.query(q, [email], function (err, result) {
			if (err){
				console.log(err);
				res.end(err);
			} else {
				if (result.length){
					console.log('admin');
					req.session.role = 'admin';
					res.end('admin');
				} else {
					console.log('user');
					req.session.role = 'user';
					res.end('user');
				}
			}
			});
		});
	app.route('/getpath')
		.post((req, res) => {
			var id = req.body.id;
			var q = "SELECT dir FROM map_ids WHERE id=?";
			console.log("into getpath");
			connection.query(q, [id], function (err, result) {
			if (err){

				res.end(err);
			} else {

				res.end(result[0].dir);
			}
			});
		});
app.listen(port);
console.log('Browser to http://127.0.0.1:'+port);

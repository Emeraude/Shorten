#!/usr/bin/node

var mariadb = require('mariasql');
var anybase = require('anybase');
var render = require('./render');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var db = new mariadb();
db.connect({
    host: '127.0.0.1',
    user: 'root',
    password: 'toor',
    db: 'shorten'
});

server.listen(8080);
app.use(require('compression')())
    .use(require('serve-static')('public/'))
    .engine('jade', require('jade').__express);

var links = {};
var shorted = {};

db.query('SELECT * FROM Links')
    .on('result', function(res) {
	res.on('row', function(row) {
	    links[row.url] = row.id;
	    shorted[anybase(16, row.id, 10)] = row.url;
	});
    })
    .on('end', function() {
	app.get('/:nb', function(req, res) {
	    if (req.params.nb.match(/[\da-f]+/i)
		&& shorted[req.params.nb.toUpperCase()]) {
		res.status(302)
		    .set('Location', shorted[req.params.nb.toUpperCase()])
		    .end();
	    }
	    else
		render.render(req, res);
	}).get('*', render.render);
    });

io.on('connection', function(socket) {
    console.log(socket);
});
db.end();

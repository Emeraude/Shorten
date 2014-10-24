#!/usr/bin/node

var mariadb = require('mariasql');
var anybase = require('anybase');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var host = process.env.HOST || '0.0.0.0';
var dbConfig = require('./db.config.json');
var db = new mariadb();
db.connect(dbConfig);

server.listen(port, host, function(err) {
    if (err) throw err;
    else
	console.log("Shorten started on " + host + ":" + port);
})

app.use(require('compression')())
    .use(require('serve-static')('public/'))
    .engine('jade', require('jade').__express);

var links = {};
var shorted = {};

db.query('SELECT * FROM Links')
    .on('result', function(res) {
	res.on('row', function(row) {
	    links[row.url] = anybase(62, row.id, 10);
	    shorted[anybase(62, row.id, 10)] = row.url;
	});
    })
    .on('end', function() {
	app.get('/:nb', function(req, res) {
	    if (req.params.nb.match(/[\da-z]+/i)
		&& shorted[req.params.nb.toUpperCase()]) {
		res.status(302)
		    .set('Location', shorted[req.params.nb])
		    .end();
	    }
	    else
		res.render('home.jade');
	}).use(function(req, res, next) {
	    res.render('home.jade');
	});
    });

io.on('connection', function(socket) {
    socket.on('shorten-it', function(url) {
	if (links[url])
	    socket.emit('shortened',
			{
			    original: url,
			    short: socket.handshake.headers.referer + links[url]
			});
	else {
	    db.query('INSERT INTO Links(url) VALUES(:url)', {url: url})
		.on('end', function() {
		    db.query('SELECT * FROM Links WHERE url=:url', {url: url})
			.on('result', function(res) {
			    res.on('row', function(row) {
				links[row.url] = anybase(62, row.id, 10);
				shorted[anybase(62, row.id, 10)] = row.url;
				socket.emit('shortened',
					    {
						original: url,
						short: socket.handshake.headers.referer + links[url]
					    });
			    });
			});
		});
	}
    });
});

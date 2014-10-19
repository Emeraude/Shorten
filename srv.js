#!/usr/bin/node

var app = require('express')();
var mariadb = require('mariasql');
var anybase = require('anybase');

var db = new mariadb();
db.connect({
    host: '127.0.0.1',
    user: 'root',
    password: 'toor',
    db: 'shorten'
});

app.use(require('compression')())
    .use(require('serve-static')('public/'))
    .engine('jade', require('jade').__express)
    .listen(8080);

var links = {};
var shorted = {};

db.query('SELECT * FROM Links')
    .on('result', function(res) {
	res.on('row', function(row) {
	    links[row.url] = row.id;
	    shorted[row.id] = row.url;
	});
    })
    .on('end', function() {
	app.get('/:nb', function(req, res) {
	    if (req.params.nb.match(/[\da-f]+/i)
		&& shorted[anybase(10, req.params.nb.toUpperCase(), 16)]) {
		res.status(302)
		    .set('Location', shorted[anybase(10, req.params.nb.toUpperCase(), 16)])
		    .end();
	    }
	    else
		;// home page
	})
    });


db.end();

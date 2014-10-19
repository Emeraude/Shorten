#!/usr/bin/node

var app = require('express')();
var mariadb = require('mariasql');

var db = new mariadb();
db.connect({
    host: '127.0.0.1',
    user: 'root',
    password: 'toor',
    db: 'shorten'
});

app.use(require('compression')())
    .use(require('serve-static')('public/'));

var links = {};

db.query('SELECT * FROM Links')
    .on('result', function(res) {
	res.on('row', function(row) {
	    links[row.url] = row.id;
	});
    })
    .on('end', function() {
	app.get('/:nb', function(req, res) {
	    if (req.params.nb.match(/[\da-f]+/i))
		;// redirection
	    else
		;// home page
	})
    });


db.end();

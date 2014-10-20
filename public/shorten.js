$(function() {
    var socket = io.connect(location.origin);

    $('form#short').submit(function(e) {
 	var url = $(this).find('input[type=text]').val();
	socket.emit('shorten-it', url);
	var spinner = new Spinner({
	    top: '15px',
	    left: '15px',
	    corners: 1.0,
	}).spin();
	$('div#shortened').append($('<p data-url="'+url+'">').append(spinner.el));
	e.preventDefault();
    });

    socket.on('shortened', function(url) {
	var div = $('div#shortened > p[data-url="'+url.original+'"]');
	div.html('<a href="'+url.short+'">'+url.short+'</a><br /><span class="original">'+url.original+'</span>');
    });
});

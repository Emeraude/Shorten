$(function() {
    socket = io.connect(location.origin);

    $('form#short').submit(function(e) {
	url = $(this).find('input[type=text]').val();
	socket.emit('shorten-it', url);
	var spinner = new Spinner({
	    top: '15px',
	    left: '15px',
	    corners: 1.0,
	}).spin();
	$('div#shortened').append($('<div data-url="'+url+'">').append(spinner.el));
    });

    socket.on('shortened', function(url) {
	console.log(url);
	/* hide the loading spin */
    });
});

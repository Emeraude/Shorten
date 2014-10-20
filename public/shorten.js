$(function() {
    socket = io.connect(location.origin);

    $('form#short').submit(function(e) {
	socket.emit('shorten-it', $(this).find('input[type=text]').val());
	/* make the loading spin visible */
	e.preventDefault();
    });
});

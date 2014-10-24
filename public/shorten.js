$(function() {
    var socket = io.connect(location.origin);

    $('form#short').submit(function(e) {
 	var url = $(this).find('input[type=text]').val();
        var RegexUrl = /(nfs|sftp|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        if (RegexUrl.test(url) == false) {
	    $('#url').css('border', '2px solid red');
	}
	else {
	    $('#url').css('border', '1px solid gray');
	    socket.emit('shorten-it', url);
	    var spinner = new Spinner({
		top: '25px',
		left: '25px',
		corners: 1.0,
	    }).spin();
	    $('div#shortened').append($('<p data-url="'+url+'">').append(spinner.el));

	}
	e.preventDefault();
    });

    socket.on('shortened', function(url) {
	var div = $('div#shortened > p[data-url="'+url.original+'"]');
	div.html('<a href="'+url.short+'">'+url.short+'</a><br /><span class="original">'+url.original+'</span>');
    });
});

define([

	'jails'

], function( jails ){

	jails.view('my-view', function( html ){

		this.init = function(){
			html.append('my-view is loaded!');
		};

	});

});

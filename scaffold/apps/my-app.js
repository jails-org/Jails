define([

	'lib/jails',
	'apps/structure'

], function( jails ){

	jails.app('my-app', function(html){

		this.init = function(){
			html.append('my-app is loaded');
		};

	});

});

define([

	'jails',
	'modules/presence',
	'apps/structure'

], function( jails, Presence ){

	var config = {
		required :{ divs : 'div' },
		optional :{ paragraphs : 'p', form :'form' }
	};

	jails.app('my-app', function(html){

		var presence = Presence.create( html );

		this.init = function(){
			presence.init( config );
		};

		presence.done = function(cfg){
			html.append('my-app is loaded');
			console.log( cfg );
		};

	});

});

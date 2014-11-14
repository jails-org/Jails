define([

	'jails',
	'mods/url/url',
	'mods/presence/presence',
	'comps/ga/ga'

], function( jails, url, Presence ){

	var config, presence, app, view;

	config = {
		required :{ divs : 'div' },
		optional :{ paragraphs : 'p', form :'form' }
	};

	jails.app('my-app', function(html){

		app = this;

		presence = Presence.create( html );

		this.init = function(){
			presence.init( config );
			this.listen('my-view:emit', log);
		};

		presence.done = function(cfg){
		};

		function log(){
			console.log('app gets emit');
		}

	});
});

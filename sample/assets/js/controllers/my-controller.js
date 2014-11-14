define([ 'jails' ],function( jails ){

	jails.controller('my-controller', function(html){

		var _self = this, view;

		this.init = function(){

			html.append('my-controller is loaded!');
			this.listen('my-view:shout', log);
		};

		function log(e){
			console.log('controller gets', 'emit', arguments);
		}

	});

});

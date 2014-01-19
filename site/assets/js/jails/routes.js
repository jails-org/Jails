/**
 * @class Routes
 **/

define([

	'jails-app',
	'app/controller'

],function( jails, controller ){

	jails.routes = [{ '#!/:page' :controller.index }];

});


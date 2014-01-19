/**
 * @class Controller
 */

define(['jails-app'], function(jails){

	var controller;

	jails.extend('controller', controller = {

		index :function( page ){

			jails.trigger('update-page', page);
		}
	});

	return controller;
});

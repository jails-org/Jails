/**
 * @class Controller
 */

define(['jails-app'], function(jails){
	
	var controller;

	jails.extend('controller', controller = {

		index :function( page ){
			controller.trigger('update_page', page);
		}
	});

	return controller;
});

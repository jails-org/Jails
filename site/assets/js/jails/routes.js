/**
 * @class Routes
 */
;(function( namespace ){

	namespace.routes = [
		{ '#!/:page' :function(page){	
			Home.Controller.index(page);
		}}
	]
		
})( Jails )

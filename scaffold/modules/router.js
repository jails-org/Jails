define(function(){

	var uri = null, win = $(window);

	var Router = {

		context:location,
		routes :null,

		execute:function(routes, url){

			routes = routes || this.routes;
			url    = url || this.context.hash;

			return filter( routes, url );
		},

		watch :function(routes){

			this.routes = routes;
			win.on('hashchange', change);

		}
	};

	function change(){

		if( !location.hash ) return;

		if( uri != location.hash ){
			uri = location.hash;
			Router.execute( null, Router.context.hash );
		}
	}

	function filter(array, url){

		var
			result = null,
			i, json, key, param, aux, len, j, k, ret;

		ret = {};

		for( i = 0; i < array.length; i++){
			json = array[i];

			for( key in json ){

				param = key.match(/(\w*)\/\:\w*/g);
				aux = key.replace(/\:\w*/g, '([^&/#?]+)');

				if( result = url.match( aux ) ){

					result.shift();
					len = result.length;

					for(j = 0; j < len; j++){
						result[j] = decodeURIComponent( result[j] );
						k = param[j].split(/\//).shift() || 'root';
						ret[ k ] = result[j];
					}

					json[key].apply( ret, result );

					return ret;
				}
			}
		}

		return ret;
	};

	return Router;

});

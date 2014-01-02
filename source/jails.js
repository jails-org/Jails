/**
 *@class Jails
 *@author Eduardo Ottaviani
 */
(function (root, factory) {

	if (typeof exports === 'object' && exports) {
		factory( exports ); // CommonJS
	}else{
		
		var jails = {};
		factory( jails );
		
		if (typeof define === "function" && define.amd) {
			define( jails ); // AMD
		}else{
			root.Jails = jails; // <script>
		}
	}

}(this, function (Jails) {	

    var 
		cache = {};

	Jails.routes = {}; 
	Jails.params = {};

	Jails.extend = function(type, object){
		
		var 
			mvc = Jails.mvc,
			type = mvc[type]._class;
		
		if( mvc && type ) type.apply( object );
	}

	Jails.set_cache = function(name, data, alt){
		cache[name] = cache[name] || {};
		cache[name][alt || this.url.path()] = data;
	}

	Jails.get_cache = function(name, alt){				
		if(cache[name]){ return cache[name][alt || this.url.path()];}
		return null;
	}
				
}));

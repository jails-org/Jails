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
		cache = {},
		body = $(document.body);

	Jails.routes = {};
	Jails.params = {};
	Jails.events = [];

	Jails.extend = function(type, object){

		var
			mvc = Jails.mvc,
			type = mvc[type]._class;

		if( mvc && type ){

			type.apply( object, [object.name] );

			if( object.name ){
				Jails.modules[ object.name ] = object;
			}
		}
	}

	Jails.set_cache = function(name, data, alt){
		cache[name] = cache[name] || {};
		cache[name][alt || this.url.path()] = data;
	}

	Jails.get_cache = function(name, alt){
		if(cache[name]){ return cache[name][alt || this.url.path()];}
		return null;
	}

	Jails.trigger = function(name, args){
		body.trigger(name, args); 
	}

	Jails.on = function(ev, method){
		body.bind( ev, bind(method) );
		Jails.events.push(ev);
	}

}));

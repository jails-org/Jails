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

	Jails.events = [];

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

	function bind(method){
		return function(e){
			method.apply( Jails, arguments );
		}
	}

}));

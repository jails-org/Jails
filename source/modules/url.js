/**
 *	@class URL 
 *	@author Eduardo Ottaviani
 */

(function (root, factory) {

	if (typeof exports === 'object' && exports) {
		factory( exports ); // CommonJS
	}else{
		
		var url = {};
		factory( url );
		
		if (typeof define === "function" && define.amd) {
			define( url ); // AMD
		}else{
			root.Url = url; // <script>
		}
	}

}(this, function (Url) {

	Url._class = function(object){

		_interface.redirect.apply(this);	

		var 
			url = '', observe = false;

		this.root = '#!';

		this.get = function(uri){
			return uri ? uri.split(this.root).pop() :url.split(this.root).pop();
		};

		this.path = function(){
			return url;
		};

		this.observe = function(bool){

			observe = true;
			var hash = object.hash;

			if(!hash) return 'Jails have not hash object to observe url';

			hash.update = function(){ 
				url = location.href;
				object.params = filter( object.routes, url );
			};

			hash.start();	
		};

		this.redirect[Object] = function(json){
			this.redirect('', json);
		};

		this.redirect[String][1] = function(dest){
			
			if(!dest.replace)
				return this.redirect(this, '', dest);

			if(!url.match(/#/))
				url = url + this.root + dest;
			else
				url = url.split( this.root )[0] + this.root + dest;

			if(observe)
				return location.href = url;

			object.params = filter(object.routes, url);
		};

		this.redirect[String][2] = function(dest, params){
				
			for(var i in params)
				dest += '/' + i + '/' + params[i];	

			this.redirect(dest);
		};	
	}

	Url.create = function(o){
		return new this._class(o);
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
				aux = key.replace(/\:(\w*)/g, '([^&/#?]*)');
				
				if( result = url.match( aux ) ){
					
					result.shift();
					len = result.length;
					
					for(j = 0; j < len; j++){	
						result[j] = decodeURIComponent( result[j] );
						k = param[j].split(/\//).shift() || 'root';
						ret[ k ] = result[j];
					}

					return json[key].apply( null, result );
				}
			}
		}

		return ret;
	};

	_interface = {
			
		redirect :function(){
			
			this.redirect = function(){
				return this.redirect[arguments[0].constructor].apply(this, arguments);
			};

			this.redirect[Object] = function(){
				return this.redirect[Object][arguments.length].apply(this, arguments);
			};

			this.redirect[String] = function(){
				return this.redirect[String][arguments.length].apply(this, arguments);
			};
		}
	};

}));

;(function(global){	
	
	//Static
	var 
		variables = {},
		include = new Jails.Include();

	function replace(string){
		var pattern =  /\{(\w*)\}/g;
		var html = string.replace(pattern, function(key){
			return variables[key.slice(1, -1)] || '';
		});
		return html;
	}

	function each(array){
		var array = Array.prototype.slice.call(array);
			for(var i = 0; i < array.length; i++){
				if(array[i].replace){
					array[i] = replace(array[i]);
				}
			}
		return array;
	}

	global
		.namespace = {
			
			minify   :function( minify ){ 
				include.minify = minify;
			},

			options  :function( options ){ 
				include.options = options;  
			},

			add :function(name, url){
				variables[name] = url;	
			},

			load :function(){
				return include.load.apply(include, each(arguments));
			},

			using :function(){
				return include.using.apply(include, each(arguments));
			},

			remove :function(name){
				delete namespaces[name];
			}
		}

})(Jails)

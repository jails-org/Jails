/**
 *@class Mvc
 *@author Eduardo Ottaviani
 */

;(function(namespace){

    //Static
    var cache = {};

	var Jails = {

		routes :{},
        params :{},

		extend :function(type, object){
			Mvc[type].apply(object);
		},

        plugin :function(name, object){

            if(name in this){
                throw new Error('Jails already have a plugin with this name :' + name);
            }                
            
            Jails[name] = object;
        },

        set_cache :function(name, data, alt){
            cache[name] = cache[name] || {};
            cache[name][alt || this.url.path()] = data;
        },

	    get_cache :function(name, alt){				
            if(cache[name]){ return cache[name][alt || this.url.path()];}
            return null;
        }
	};


	var Mvc = {

		Model :function(){
			this.data = this.data || {};			
	    },
		
		View :function(){
			var pattern = /.{(\w*)\}/g;
			
			this.inject = function( json, template ){
				var html = decodeURIComponent(template).replace( pattern, function(key){
					return json[ key.slice(2, -1) ];	
				});
				return html;
			};

            this.template = function(id){ return document.getElementById(id).innerHTML; };
			
			(this.initialize || function(){}).call(this);
			
		},
		
		Controller :function(){
           Interface.command.filter.apply(this, ['before']); 
           Interface.command.filter.apply(this, ['after']); 
        }
		
	};

	var Url = {
			
		Class :function(){
			
			Interface.polymorphism.redirect.apply(this);	

			var url = '', observe = false;

			this.root = '#!';

			this.get = function(uri){
				return uri ? uri.split(this.root).pop() :url.split(this.root).pop();
			};

			this.path = function(){
				return url;
			};

			this.observe = function(){

				observe = true;	
				var hash = new Jails.Hashchange();

				hash.update = function(){ 
					url = location.href;
					filter( Jails.routes, url );
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

				filter(Jails.routes, url);

			};

			this.redirect[String][2] = function(dest, params){
					
				for(var i in params)
					dest += '/' + i + '/' + params[i];	

				this.redirect(dest);
			};	

		}

	};

	
	function filter(array, url){	
	
		var result = null;
			Jails.params = {};

			for(var i = 0; i < array.length; i++){
				var json = array[i];
				
				for( var key in json ){
					
					var param = key.match(/(\w*)\/\:\w*/g);
					var aux = key.replace(/\:(\w*)/g, '([^&/#?]*)');
					
                    if( result = url.match( aux ) ){
						
                        result.shift();
						var len = result.length;
						
                        for(var j = 0; j < len; j++){	
							result[j] = decodeURIComponent( result[j] );
                            var k = param[j].split(/\//).shift() || 'root';
							Jails.params[ k ] = result[j];
						}

						return json[key].apply( this, result );
					}

				}

			}
	};

	var Interface = {

		polymorphism :{
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
		},

        command :{
            
            filter :function(when){
               
               this[when + '_filter'] =  this[when + '_filter'] || { filter :function(){}, action :[] };
                
               var action = this[when + '_filter'].action;
               var filter = this[when + '_filter'].filter;

               for(var i = 0; i < action.length; i++){
                    var method = this[action[i]];
                    this[action[i]] = (function(){
                        if(when == 'before'){
                            return function(){
                                filter.apply(this, arguments);
                                method.apply(this, arguments);
                            }
                        }else{
                            return function(){
                                method.apply(this, arguments);
                                filter.apply(this, arguments);
                            }
                        }
                    })()
               }

            }

        }

	};

		
	namespace.Jails = Jails;
	namespace.Jails.url = new Url.Class();

})(window);

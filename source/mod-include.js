/**
 * @author Eduardo Ottaviani
 * @class Script
 */
;(function(namespace, $){

	//Static
	var
		slice = Array.prototype.slice;
	
	var Include = {
		
		scripttag :$.getScript,

		Class :function(url){
			
			var 
				cache	= {},
				fifo	= [],
				params  = null,
				callback= new Function,
				scripttag = Include.scripttag;
			
			url = url || '';
			
			this.minify		= '';
			this.options	= '';
			
			//Private

			function script_loaded(){
				
					if(!fifo.length){
						return callback(params);	
					}

				fifo.shift();
				create.call(this);

			};

			function create(){
				
				var self = this;

					if( !fifo.length ) return callback(params);
	
					if( fifo[0] in cache ){
						fifo.shift();
						return create.call(this);
					}
	
				cache[ fifo[0] ] = true;
	
				scripttag( this.minify + url +  fifo[0] + this.options, function(){
					script_loaded.call(self);
				});

			};

			//Public Methods

			this.load = function(/* ... ,callback*/){
				
				var args = slice.call( arguments.length ? arguments :fifo );
				var last_arg = args[ args.length - 1 ];

					if( last_arg.call ){	
						callback = args.pop();
					}

				fifo = args;
				create.call(this);
			};

			this.using = function(){

				var args = slice.call( arguments );
				var self = this;

				return function(callback){
					args.push( callback );
					self.load.apply( self, args );
				}
			}	

		}
		
	};

	namespace.Include = Include.Class;
	
})(Jails, jQuery)

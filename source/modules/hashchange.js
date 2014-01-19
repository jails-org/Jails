(function (root, factory) {

	if (typeof exports === 'object' && exports) {
		factory( exports ); // CommonJS
	}else{
		
		var hash = {};
		factory( hash );
		
		if (typeof define === "function" && define.amd) {
			define( hash ); // AMD
		}else{
			root.Hash = hash; // <script>
		}
	}

}(this, function (Hash) {

	var 
		Bridge, 
		_interface;
	
	Hash._class = function(){
		
		var
			url		= null,
			_self	= this,
			win = $(window);

		this.timer  = 100;
		this.update = function(){};
	
		function listener(){
			
			if( !location.hash ) return;

			if( url != location.hash ){
				url = location.hash;
				_self.update( location.hash.substring(1) );
			}
		};

		_interface.apply(this, [listener, win]);
	}

	Hash.create = function(o){
		return new this._class(o);
	}
	
	_interface = (function(name){
	
		return({
			
			hashchange :function(listener, win){
				
				this.start = function(){ 
					if(location.hash){ this.update(); };
					win.bind('hashchange', listener); 
				};
				
				this.stop = function(){ win.unbind('hashchange'); };
			},
			
			timer :function(listener){            
				var clock = null
				this.start = function(){ clock = setInterval( listener, this.timer ); };
				this.stop = function(){ clearInterval( clock ); };
			}
	
    	})[name];
	
	})( 'onhashchange' in window? 'hashchange' :'timer' );

}));

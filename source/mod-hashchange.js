;(function (namespace){
	
	var Hashchange = {
		
		Class :function(){
		
			var
				url		= null,
				self	= this,
                win     = $(window),
                has_hashchange = 'onhashchange' in window,
                interfaces = Bridge.hash(has_hashchange);
			
			this.timer  = 100;
			this.update = function(){};
		
			function listener(){
				if( !location.hash ) return;

				if( url != location.hash ){
					url = location.hash;
					self.update( location.hash.substring(1) );
				}
			};

            interfaces.apply(this, [listener, win]);
		}

	};

    var Bridge = {
        
        hash :function(bool){
            if(bool) return Interface.hashchange;
            return Interface.timer;
        }
    };

    var Interface = {
        
        hashchange :function(listener, win){
            this.start = function(){ 
                if(location.hash){ this.update(); };
                win.bind('hashchange', listener); 
            };
            this.stop = function(){ win.unbind('hashchange'); };
        },
        
        timer :function(listener){            
            var clock = null;
            this.start = function(){ clock = setInterval( listener, this.timer ); };
            this.stop = function(){ clearInterval( clock ); };
        }
    };
  
	namespace.Hashchange = Hashchange.Class;

})(Jails)

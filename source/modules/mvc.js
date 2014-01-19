/**
 *	@class MVC 
 *	@author Eduardo Ottaviani
 */
(function (root, factory) {

	if (typeof exports === 'object' && exports) {
		factory( exports ); // CommonJS
	}else{
		
		var mvc = {};
		factory( mvc );
		
		if (typeof define === "function" && define.amd) {
			define( mvc ); // AMD
		}else{
			root.Mvc = mvc; // <script>
		}
	}

}(this, function (Mvc) {


	Mvc.model = {
		
		_class :function(){
			this.data = this.data || {};
		}
	};

	Mvc.controller = {

		_class :function(){}
	};
	
	Mvc.view = { 
		
		_class :function(){

			var
				pattern = /[$#@]{(\w*)\}/g,
				_self = this,
				body = $(document.body);
				
			this.inject = function( json, template ){
				var html = decodeURIComponent(template).replace( pattern, function(key){
					return json[ key.slice(2, -1) ];
				});
				return html;
			};

			this.template = function(id){ 
				return document.getElementById(id).innerHTML; 
			};

			this.notify = function(name, args){
				Jails.trigger(name, args);
			}

			function bind(method){
				return function(e){
					method.apply( _self, arguments );
				}
			}

			;(this.initialize || function(){}).call(this);
		}
	}

}));

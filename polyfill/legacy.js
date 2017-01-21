// For a complete compatibitily across browsers, including IE8, please use jQuery 1.9.1
// code.jquery.com/jquery-1.9.1.min.js
;(function( exports, factory ){
	// UMD export
	if ( typeof define === 'function' && define.amd ) {
		define(['jquery', 'jails'], factory);
	} else if ( typeof module !== 'undefined' && module.exports ){
		module.exports = factory( require('jquery'), require('jails') );
	} else {
		factory( exports.jQuery, exports.jails );
	}
})(this, function( jquery, jails ){

	jails.events = {

		on :function(el, ev, selectOrCallback, callback){

			var cb = callback || selectOrCallback;

			if( callback )
				$(el).on(ev, selectOrCallback, handler);
			else
				$(el).on(ev, handler);

			function handler(e, data){
				e.detail = data? data.detail :e.detail;
				e.detail = e.detail || {};
				return cb.apply(this, [e].concat(e.detail.args));
			}
		},

		off:function(el, ev, callback){
			$(el).off(ev, callback);
		},

		trigger :function(el, ev, args){
			$(el).trigger(ev, {detail:args} );
		}
	};

});

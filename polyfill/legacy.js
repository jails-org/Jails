;(function () {

	if ( typeof window.CustomEvent === "function" ) return false;

	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent;


	// Production steps of ECMA-262, Edition 5, 15.4.4.18
	// Reference: http://es5.github.com/#x15.4.4.18

	if ( !Array.prototype.forEach ) {

		Array.prototype.forEach = function forEach( callback, thisArg ) {

			var T, k;

			if ( this == null ) {
				throw new TypeError( "this is null or not defined" );
			}

			// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
			var O = Object(this);

			// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
			// 3. Let len be ToUint32(lenValue).
			var len = O.length >>> 0; // Hack to convert O.length to a UInt32

			// 4. If IsCallable(callback) is false, throw a TypeError exception.
			// See: http://es5.github.com/#x9.11
			if ( {}.toString.call(callback) !== "[object Function]" ) {
				throw new TypeError( callback + " is not a function" );
			}

			// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
			if ( thisArg ) {
				T = thisArg;
			}

			// 6. Let k be 0
			k = 0;

			// 7. Repeat, while k < len
			while( k < len ) {

				var kValue;

				// a. Let Pk be ToString(k).
				//   This is implicit for LHS operands of the in operator
				// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
				//   This step can be combined with c
				// c. If kPresent is true, then
				if ( Object.prototype.hasOwnProperty.call(O, k) ) {

					// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
					kValue = O[ k ];

					// ii. Call the Call internal method of callback with T as the this value and
					// argument list containing kValue, k, and O.
					callback.call( T, kValue, k, O );
				}
				// d. Increase k by 1.
				k++;
			}
			// 8. return undefined
		};
	}

	if (!Object.keys) Object.keys = function(o) {
		if (o !== Object(o))
		throw new TypeError('Object.keys called on a non-object');
		var k=[],p;
		for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
		return k;
	}

})();

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
})(this, function( $, jails ){

	jails.events = {

		on :function(el, ev, callback){

			el.__events = el.__events || {};
			el.__events[ev] = true;

			if( callback.call )
				$(el).on(ev, handler(callback));
			else
				Object.keys(callback).forEach(function( selector ){
					$(el).on(ev, selector, handler(callback[selector]));
				});
			function handler( cb ){
				return function(e, data){
					e.detail = data? data.detail :e.detail;
					e.detail = e.detail || {};
					return cb.apply(this, [e].concat(e.detail.args));
				}
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

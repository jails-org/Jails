;(function( exports ){

	var publisher = pubsub();

	function jails( name, mixin ){
		jails.components[ name ] = mixin;
	}

	jails.events = events();
	jails.components = {};
	jails.publish = publisher.publish;
	jails.subscribe = publisher.subscribe;

	jails.start = function( ctx ){
		ctx = ctx || document.documentElement;
		each(ctx.querySelectorAll('[data-component]'), scan, true);
	};

	jails.destroy = function( ctx, query ){

		ctx = ctx || document.documentElement;
		query = query || '[data-component]';

		each(ctx.querySelectorAll( query ), function( node ){
			(node.__eventHandlers[':destroy'] || function(){}).call( node, node );
			node.__events = null;
			node.__eventHandlers = null;
			node.j = null;
		}, true);
	};

	jails.component = function( name, node, fn ){

		var data = {}, init = function(){};

		var base = {

			elm 		:node,
			subscribe 	:publisher.subscribe,
			publish   	:publisher.publish,

			on :function( ev, callback ){
				jails.events.on( node, ev, callback );
			},

			init :function( callback ){
				init = callback;
			},

			props :function( key ){
				data.props = data.props || properties( node );
				return key? data.props[key] : data.props;
			},

			annotations :function( key ){
				data.annotations = data.annotations || annotations( node )[ name ] || {};
				return key? data.annotations[key] : data.annotations;
			},

			set( n, f ){
				node.j[name].methods[n] = f;
			},

			get :function( n, query ){
				return function(){
					var args   = Array.from( arguments );
					var method = args.shift();
					query = query? '[data-component*='+n+']' + query : '[data-component*='+n+']';
					each( node.querySelectorAll(query), function( el ){
						if( el.j && method in el.j[n].methods )
							el.j[n].methods[method].apply(null, args);
						if( node.matches(query) )
							node.j[n].methods[method].apply(null, args);
					});
				}
			},

			emit( n, params ){

				var p = node.parentNode;
				var ev = ':' + n;

				while( p ){
					if( p.j ){
						Object.keys(p.j).forEach(function( name ){
							if( p.__eventHandlers[ev] ){
								p.__eventHandlers[ev].call( node, node, params );
							}
						});
					}
					p = p.parentNode;
				}
			}
		};

		fn( base, node, base.props );
		init( base );
	};

	function annotations( node ){

		let ann = {}, comment;

		comment = node.previousSibling;
		comment = comment && comment.nodeType == 8? comment :comment? comment.previousSibling : null;

		if( comment && comment.nodeType == 8 ){
			comment.data.replace(/@([a-zA-z0-9-\/]*)(?:\((.*)\))?/g, function( text, component, param ){
				ann[component] = new Function('return '+ param)();
			});
		}

		return ann;
	}

	function scan( node ){
		var components = node.getAttribute('data-component').split(/\s/);
		each( components, mount(node) );
	}

	function mount( node ){
		return function( name ){
			if( name in jails.components ){
				node.j = node.j || {};
				node.j[name] = { methods :{} };
				jails.component( name, node, jails.components[name] );
			}
		};
	}

	function properties( node ){
		var props = { data:{} };
		each( node.attributes, propset(props) );
		return props;
	}

	function propset( acc ){
		return function( item ){
			var value, name = item.name.split(/data\-/);
			try{ value = item.value in window? item.value :(new Function('return '+ item.value))(); }
			catch(err){ value = item.value; }

			if( name[1] ) acc.data[name.pop().replace(/-([a-z])/g, upper)] = value;
			else acc[item.name] = value;
			return acc;
		};
	}

	function upper(m, string){
		return string.toUpperCase();
	}

	function each( list, callback, reverse ){
		list = reverse? Array.from( list ).reverse() : list;
		for( var i = 0, len = list.length; i < len; i ++ )
			callback( list[i], i, list );
	}

	function events(){

		function Ev(type, params) {
			var e = document.createEvent(type);
			params = params || {};
			e.initEvent(type, params.bubbles || false, params.cancelable || false, params.detail || null);
			return e;
		}

		function handler(node, ev){
			return function(e){
				var args = arguments;
				node.__events[ev].forEach(function(cb){ cb.apply(this, args); });
			};
		}

		function delegate( callback ){
			return function(){
				var element = this;
				var args = arguments;
				Object.keys(callback).forEach( function(key){
					if( element.matches( key ) ){
						callback[key].apply(element, args);
					}
				});
			};
		}

		return {

			on :function( node, ev, callback ){

				node.__eventHandlers = node.__eventHandlers || {};
				node.__events = node.__events || {};

				if( !node.__eventHandlers[ev] ){
					var cb = callback.call? handler(node, ev) : delegate(callback);
					node.__eventHandlers[ev] = cb;
					node.addEventListener( ev, cb, (ev == 'focus' || ev == 'blur') );
				}
				if( callback.call ){
					node.__events[ev] = (node.__events[ev] || []).concat(callback);
				}else{
					Object.keys(callback).forEach(function(key){
						(node.__events[ev] || []).concat(callback).concat( callback[key] );
					});
				}
			},

			off :function(el, ev, fn){
				if( fn && el.__events[ev] && el.__events[ev].length )
					el.__events[ev] = (el.__events[ev] || []).filter(function(cb){ return cb != fn; });
				else
					el.removeEventListener(ev, el.__eventHandlers[ev], false);
			},

			trigger :function(el, name, args){
				try{
					el.dispatchEvent( new Ev( name, { bubbles :true, detail :args } ) );
				}catch(e){
					el.dispatchEvent( new CustomEvent( name, { bubbles :true, detail :args } ) );
				}
			}
		};
	}

	function pubsub( topics, async ){

		topics = {};
		async  = {};

		return {
			publish :function( name, params ){
				if( !(name in topics) )
					async[name] = params;
				else
					each( topics[name], function( topic ){ topic( params ); });
			},
			subscribe :function( name, method ){
				topics[name] = topics[name] || [];
				topics[name].push( method );
				if( name in async )
					each( topics[name], function( topic ){ topic( async[name] ); });
				return function(){
					topics[name] = topics[name].filter(function( topic ){
						return topic == method;
					});
				};
			}
		};
	}

	// UMD export
	if ( typeof define === 'function' && define.amd ) {
		define(function () { return jails; });
	} else if ( typeof module !== 'undefined' && module.exports ){
		module.exports = jails;
	} else {
		exports.jails = jails;
	}
})( window );

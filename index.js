;(function( exports ){

	var publisher 	  = pubsub(),
		attribute 	  = 'data-component',
		selector  	  = '['+attribute+']';

	function jails( name, mixin, options ){
		jails.components[ name ] = mixin;
		jails.components[ name ].options = options || {};
		return jails;
	}

	jails.events 	 = events();
	jails.components = {};
	jails.publish 	 = publisher.publish;
	jails.subscribe  = publisher.subscribe;

	jails.start = function( ctx ){
		ctx = ctx || document.documentElement;
		each(ctx.querySelectorAll(selector), scan, true);
		return jails;
	};

	jails.destroy = function( ctx, query ){

		ctx = ctx || document.documentElement;
		query = query || selector;

		each(ctx.querySelectorAll( query ), function( node ){
			if(node.__events){
				jails.events.trigger(node, ':destroy');
				for(var ev in node.__events)
					jails.events.off(node, ev);
				node.__events = null;
				node.j = null;
			}
		}, true);
		return jails;
	};

	jails.use = function( fn ){
		fn( jails )
		return jails;
	}

	jails.extends = function( fn ){
		jails.component = compose( fn, jails.component )
		return jails;
	};

	jails.component = function( name, node, options ){

		var data = {};
		var base;
		var events = jails.events;

		//There is a strange bug in chrome,
		//It removes any custom property manually set on HTMLElement instance
		//It's intermittent. The hack below fix the problem
		var hack = function(){};
		events.on(node, ':j', hack);
		events.off(node, ':j', hack);

		return base = {

			elm 		:node,
			subscribe 	:publisher.subscribe,
			publish   	:publisher.publish,
			injection 	:options.injection,
			jails 		:jails,

			__initialize:function(){},

			expose 		:function( n, f ){
				node.j[name].methods = n;
			},

			on :function( ev, callback ){
				events.on( node, ev, callback );
			},

			off :function( ev, callback ){
				events.off( node, ev, callback );
			},

			trigger :function( ev, target, args ){
				if( target.constructor == String )
					events.trigger( node.querySelector(target), ev, {args:args} );
				else events.trigger( node, ev, {args:target} );
			},

			init :function( callback ){
				if( callback && callback.call )
					base.__initialize = function( component ){
						var ret = callback( component );
						if( ret && ret.forEach ){
							var op = {};
							ret.forEach(function(m){
								op = (m && m.call? m( component, op ) : null) || op;
							});
						}
					}
			},

			props :function( key ){
				data.props = data.props || properties( node );
				return key? data.props[key] : data.props;
			},

			annotations :function( key ){
				data.annotations = data.annotations || annotations( node )[ name ] || {};
				return key? data.annotations[key] : data.annotations;
			},

			get :function( n, query ){

				return function(){

					var args   = Array.from( arguments ),
						method = args.shift(),
						selector = '[data-component*='+n+']';

					query = query? selector + query : selector;

					each( node.querySelectorAll( query ), function( el ){
						if( el.j && el.j[n] && method in el.j[n].methods )
							el.j[n].methods[method].apply(null, args);
					});

					if( node.matches(query) ){
						if( node.j && node.j[n] && method in node.j[n].methods )
							node.j[n].methods[method].apply(null, args);
					}

				}
			},

			emit :function( n, params ){
				var args = Array.from( arguments );
				events.trigger(node, args.shift(), { args:args });
			}
		};

	};

	function annotations( node ){

		var ann = {}, comment;

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
		var components = node.getAttribute(attribute).split(/\s/);
		each( components, mount(node) );
	}

	function mount( node ){
		return function( name ){
			var base, fn;
			node.j = node.j || {};
			if( name in jails.components && !node.j[name] ){
				fn = jails.components[name];
				node.j[name] = { methods :{} };
				base = jails.component( name, node, fn.options );
				fn( base, node, base.props );
				base.__initialize( base );
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

	function compose(f1, f2){
		return function(){
			return f1(f2.apply(null, arguments))
		}
	};

	function events(){

		function handler(node, ev){
			return function(e){
				var scope = this;
				var detail = e.detail || {};
				node.__events[ev].forEach(function(o){ o.handler.apply(scope, [e].concat(detail.args)); });
			};
		}

		function removeListener( node, ev ){
			if( node.__events[ev] && node.__events[ev].listener ){
				node.removeEventListener(ev, node.__events[ev].listener, false);
				delete node.__events[ev];
			}
		}

		function delegate( node, selector, callback ){
			return function(e){
				var element = this, parent = e.target, detail = e.detail || {};
				while( parent && parent !== node ){
					if( parent.matches(selector) ){
						e.delegateTarget = parent
						callback.apply(element, [e].concat(detail.args));
					}
					parent = parent.parentNode;
				}
			};
		}

		return {

			on :function( node, ev, callback ){

				node.__events 	  = node.__events || {};
				node.__events[ev] = (node.__events[ev] || []);

				if(!node.__events[ev].length){
					var fn = handler(node, ev);
					node.addEventListener(ev, fn, (ev == 'focus' || ev == 'blur'));
					node.__events[ev].listener = fn;
				}

				if( callback.call ){
					node.__events[ev].push({ handler :callback, callback :callback });
				}else{
					Object.keys(callback).forEach(function(key){
						node.__events[ev].push({ handler :delegate(node, key, callback[key]), callback :callback[key] });
					});
				}
			},

			off :function( node, ev, fn ){

				if( fn && node.__events[ev] && node.__events[ev].length ){
					var old = node.__events[ev];
					node.__events[ev] = node.__events[ev].filter(function(o){ return o.callback != fn; });
					node.__events[ev].listener = old.listener;
					if( !node.__events[ev].length )
						removeListener( node, ev );
				}else{
					removeListener( node, ev );
				}
			},

			trigger :function( node, name, args ){
				node.dispatchEvent(new CustomEvent( name, { bubbles :true, detail :args } ));
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

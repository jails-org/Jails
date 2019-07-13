;(function( exports ){

	var publisher 	  = pubsub(),
		attribute 	  = 'data-component',
		selector  	  = '['+attribute+']';

	function jails( name, mixin, options ){
		jails.components[ name ] = mixin;
		jails.components[ name ].options = options || {};
		return jails;
	}
	
	jails.observer   = null;
	jails.events 	 = events();
	jails.components = {};
	jails.publish 	 = publisher.publish;
	jails.subscribe  = publisher.subscribe;

	jails.start = function( ctx ){
		ctx = ctx || document.documentElement;
		each(ctx.querySelectorAll(selector), scan, true);
		jails.observer = jails.observer || observe();
		return jails;
	};

	jails.destroy = function( node ){
		if( node.__events ){
			jails.events.trigger(node, ':destroy');
			for(var ev in node.__events)
				jails.events.off(node, ev);
			node.__events = null;
			node.j = null;
		}
	};

	jails.use = function( fn ){
		fn( jails )
		return jails;
	};

	jails.extends = function( fn ){
		jails.component = compose( fn, jails.component )
		return jails;
	};

	jails.component = function( name, node, options ){

		var base;
		var resolver;
		var data    = {};
		var events  = jails.events;
		var subscribers = [];
		var promise = new Promise(function (resolve) { resolver = resolve; });
		
		var main = function( callback ){
			return function( base ){
				var ret = callback( base );
				if( ret && ret.forEach ){
					var op = {};
					ret.forEach(function(m){
						op = (m && m.call? m( base, op ) : null) || op;
					});
				}
			}
		}

		events.on(node, ':destroy', function () {
			subscribers.forEach(function (topic) {
				publisher.unsubscribe(topic);
			});
		});

		return base = {
			name		:name,
			elm 		:node,
			publish   	:publisher.publish,
			injection 	:options.injection,
			jails 		:jails,

			__initialize: function (base) { resolver(base); },

			main: function (callback) {
				if (callback && callback.call)
					promise.then(main(callback));
			},

			init: function(callback){
				base.main(callback)
			},

			expose :function( n, f ){
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

			props :function( key ){
				data.props = data.props || properties( node );
				return key? data.props[key] : data.props;
			},

			get :function( n, query ){

				return function(){

					var args = Array.prototype.slice.call( arguments ),
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
				var args = Array.prototype.slice.call( arguments );
				events.trigger(node, args.shift(), { args:args });
			},

			subscribe: function( name, method ){
				subscribers.push({ name, method })
				publisher.subscribe(name, method)
			}
		};

	};

	function observe() {
		var observer = new MutationObserver(function (mutations) { mutations.forEach(onMutation); });
		observer.observe(document.body, { childList: true, subtree: true });
		return observer;
	}

	function onMutation(mutation) {
		if (mutation.type == 'childList') {
			if (mutation.addedNodes.length) {
				mutatedComponents(mutation.addedNodes, scan);
			} else if (mutation.removedNodes.length) {
				mutatedComponents(mutation.removedNodes, jails.destroy);
			}
		}
	}

	function mutatedComponents(nodeList, callback) {
		var nodes = Array.prototype.slice.call(nodeList).reduce(function (acc, node) {
			return node.querySelectorAll ? [node].concat(Array.prototype.slice.call(node.querySelectorAll(selector))) : [node];
		}, []);
		each(nodes, function (node) {
			(node.getAttribute && node.getAttribute(attribute)) ? callback(node) : null;
		}, true);
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
				node.j[name] = { methods: {} };
				base = jails.component(name, node, fn.options);
				fn(base, node, base.props);
				base.__initialize(base);
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
		list = reverse? Array.prototype.slice.call( list ).reverse() : list;
		for( var i = 0, len = list.length; i < len; i ++ )
			if (list[i]) callback(list[i], i, list);
	}

	function compose(f1, f2){
		return function(){
			return f1(f2.apply(null, arguments))
		}
	};

	function events(){

		var customEvent = (function(){
			return ('CustomEvent' in window && typeof window.CustomEvent === 'function')
				? function (name, data) { return new CustomEvent(name, data); }
				: function (name, data) {
					var newEvent = document.createEvent('CustomEvent');
					newEvent.initCustomEvent(name, true, true, data);
					return newEvent;
				}
		})();

		function handler(node, ev){
			return function(e){
				var scope = this;
				var detail = e.detail || {};
				node.__events[ev].forEach(function(o){ 
					o.handler.apply(scope, [e].concat(detail.args)); 
				});
			};
		}

		function removeListener( node, ev ){
			if( node.__events[ev] && node.__events[ev].listener ){
				node.removeEventListener(
					ev, 
					node.__events[ev].listener, 
					(ev == 'focus' || ev == 'blur' || ev == 'mouseenter' || ev == 'mouseleave'));
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
					node.addEventListener(
						ev, 
						fn, 
						(ev == 'focus' || ev == 'blur' || ev == 'mouseenter' || ev == 'mouseleave'));
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
				node.dispatchEvent(customEvent(name, { bubbles: true, detail: args }) );
			}
		};
	}

	function pubsub( topics, _async ){

		topics = {};
		_async  = {};

		return {
			publish :function( name, params ){
				if( !(name in topics) )
					_async[name] = params;
				else
					each( topics[name], function( topic ){ topic( params ); });
			},
			subscribe :function( name, method ){
				topics[name] = topics[name] || [];
				topics[name].push( method );
				if( name in _async )
					each( topics[name], function( topic ){ topic( _async[name] ); });
			},
			unsubscribe :function(topic){
				topics[topic.name] = (topics[topic.name]||[]).filter(function (t) {
					return t != topic.method;
				});
				_async[topic.name] = (_async[topic.name] || []).filter(function (t) {
					return t != topic.method;
				});
				if( !topics[topic.name].length ) delete topics[topic.name]
				if( !_async[topic.name].length ) delete _async[topic.name]
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
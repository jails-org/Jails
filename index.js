;(function( exports ){

	var publisher = pubsub(),
		data 	  = 'data-component',
		selector  = '['+data+']';

	function jails( name, fn ){
		jails.components[ name ] = fn;
	}

	jails.components = {};
	jails.events 	 = on();
	jails.publish 	 = publisher.publish;
	jails.subscribe	 = publisher.subscribe;

	jails.start = function( ctx ){
		ctx = ctx || document.documentElement;
		each( ctx.querySelectorAll(selector), scan, true );
	};

	jails.destroy = function( node ){
		jails.events.trigger( node, 'destroy' );
	};

	jails.render = function( node, html ){
		var child;
		while( child = node.firstChild ){
			if( child.getAttribute && child.getAttribute(data) )
				jails.destroy( child );
			node.removeChild( child );
		}
		node.innerHTML = html;
		jails.start( node );
	};

	jails.component = function( name, node ){

		var instance = {

			name 		:name,
			publish		:publisher.publish,
			subscribe 	:publisher.subscribe,
			on 			:jails.events.on,

			init :function(){},

			destroy: function(){},

			on :function( ev, selectorOrCallback, callback ){
				return jails.events.on( node, ev, selectorOrCallback, callback );
			},

			off :function( ev, handler ){
				jails.events.off( node, ev, handler );
			},

			get :function( cssSelector ){
				return function( name, args ){
					var args = Array.from( arguments );
					var elements = [].concat( node.matches(cssSelector)? node : [] );
						elements = elements.concat( Array.from( node.querySelectorAll(cssSelector) ) );
					each( elements, call(args.shift(), args) );
				};
			},

			emit :function( ){
				var args = Array.from( arguments );
				jails.events.trigger( node, ':' + args.shift(), { args: args, instance : instance });
			},

			__kill :function(){
				instance.destroy();
				for(var i in this ) delete this[i];
				instance = null;
			}
		};

		jails.events.on( node, 'execute', execute( name, instance, node ) );
		jails.events.on( node, 'destroy', destroy( name, instance, node ) );

		return instance;
	};

	function scan( element, index ){
		var names = element.getAttribute(data);
			names = names.split(/\s/);
		each( names, mount( element ) );
	}

	function mount( node ){

		return function( name, index ){
			var id = 'jails#component#'+name;
			if( node[id] ) return;
			var comp  = jails.component( name, node );
			Object.assign( comp, jails.components[ name ]( comp, node, getter(name, node) ) || comp );
			comp.init();
			node[id] = true;
		};
	}

	function destroy( name, instance, node ){

		return function(e){
			instance.__kill();
			instance = null;
			clean( node );
			e.stopPropagation();
		};
	}

	function clean( node ){
		for(var e in node._events)
			jails.events.off( node, e, node._events[e].eventHandler );
		node._events = null;
		node['jails#component#'+name] = null;
	}

	function getter( name, node ){
		var props;
		return function( key ){
			if( props ) {
				return key? props[key] : props;
			}
			var anno  = annotations( node )[ name ] || {};
			var attrs = { data:{} };
			each(Array.from( node.attributes ), propset(attrs) );
			props = Object.assign({}, anno, attrs);
			return key? props[key] : props;
		};
	}

	function propset( acc ){
		return function( item ){
			var value, name = item.name.split(/data\-/);
			try{ value = (new Function('return '+ item.value))(); }
			catch(err){ value = item.value; }

			if( name[1] ) acc.data[name.pop().replace(/-([a-z])/g, upper)] = value;
			else acc[item.name] = value;

			return acc;
		};
	}

	function upper( m, string ){
		return string.toUpperCase();
	}

	function annotations( el ){

		var ann = {}, comment, code;

		comment = el.previousSibling;
		comment = comment && comment.nodeType == 8? comment :comment? comment.previousSibling : null;

		if(comment && comment.nodeType == 8){
			code = comment.data
				.replace(/@([a-zA-z0-9-\/]*)(?:\((.*)\))?/g, function( text, component, param ){
					ann[component] = new Function('return '+ param)();
				});
		}

		return ann;
	}

	//Inspired by:
	//http://dev.housetrip.com/2014/09/15/decoupling-javascript-apps-using-pub-sub-pattern/
	function pubsub(){

		var topics = {};
		var _async = {};

		return{

			subscribe :function(){

				var args = Array.from( arguments );
				var key = args[0], method = args[1];
				var _self = this;

				if( key in _async && topics[key] ){
					topics[key].push( method );
					_self.publish.apply(null, [key].concat(_async[key]));
				}else{
					topics[key] = topics[key] || [];
					topics[key].push( method );
				}
				//Unsubscribe
				return function(){
					var newtopics = [];
					var newasync  = [];

					each(topics[key], function( fn){
						if(fn != method)
							newarr.push(fn);
					});

					topics[key] = newtopics;

					each(_async[key], function( fn){
						if(fn != method)
							newarr.push(fn);
					});
					_async[key] = newasync;
				};
			},

			publish :function(){

				var args = Array.from( arguments );
				var key = args.shift();

				topics[key] = topics[key] || [];

				if(!topics[key].length){
					_async[key] = args;
				}

				else each(topics[key], function( f ) {
					if( f ) f.apply( this, args );
				});
			}
		};
	}

	function delegate( node, cssSelector, callback ){
		return function(e){
			var parent = e.target;
			while ( parent && parent !== node ) {
				if (parent.matches(cssSelector))
					callback.call(e.target, e);
				parent = parent.parentNode;
			}
		};
	}

	function execute( name, instance, node ){
		return function(e){
			if( node != e.target ) return;
			var scope  = e.detail.method.split(/\:/),
				method = scope.length > 1? scope[1] : scope[0];
			if( (method in instance) && (!scope[1]) || (scope[1] && name == scope[0]) )
				instance[ method ].apply( instance, e.detail.args );
			e.stopPropagation();
		};
	}

	function call( name, args ){
		return function( element, index ){
			jails.events.trigger( element, 'execute', { args :args, method :name });
		};
	}

	function each( iterable, callback, reverse ){
		iterable = reverse? Array.from(iterable).reverse() : iterable;
		for( var i = 0, len = iterable.length; i < len; i++ )
			callback( iterable[i], i );
	}

	function on(){

		function Ev(type, params) {
			var e = document.createEvent(type);
			params = params || {};
			e.initEvent(type, params.bubbles || false, params.cancelable || false, params.detail || null);
			return e;
		}

		return {

			on :function( el, ev, selectorOrCallback, callback ){

				var custom, isset, fn;

				el._events 	= el._events || {};
				custom 		= ev.split(/\:/);
				ev 			= custom[1]? ':' + custom[1] : custom[0];
				isset  		= (ev in el._events);
				fn     		= callback? delegate( el, selectorOrCallback, handler ) :handler;

				el._events[ev] = el._events[ev] || [];
				el._events[ev].push( callback || selectorOrCallback );

				if( !isset ){
					el.addEventListener(ev, fn, (ev == 'focus' || ev == 'blur') );
					el._events[ev].eventHandler = fn;
				}

				function handler(e){
					var detail = e.detail || {};
					el._events[ev].map(function( cb ){
						if( !detail.instance || !custom[0] || detail.instance.name == custom[0] )
							cb.apply( el, [e].concat( detail.args ) );
					});
				}

				return function(){
					jails.events.off( el, ev, callback || selectorOrCallback );
				};
			},

			off :function(el, ev, fn){
				el.removeEventListener(ev, fn, false);
				el._events[ev] = (el._events[ev] || []).filter(function(cb){ return cb != fn; });
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

	// UMD export
	if ( typeof define === 'function' && define.amd ) {
		define(function () { return jails; });
	} else if ( typeof module !== 'undefined' && module.exports ){
		module.exports = jails;
	} else {
		exports.jails = jails;
	}
})( window );

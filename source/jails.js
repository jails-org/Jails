(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define('jails', factory);
	} else if (typeof exports === 'object') {
		// Node, CommonJS-like
		module.exports = factory(require('jails'));
	} else {
		// Browser globals (root is window)
		root.jails = factory();
	}
}(this, function () {

	var publisher 	= pubsub(),
		slice 		= Array.prototype.slice,
		root		= document.documentElement,
		starregex	= /\*/;

	function Jails( name, Mixin ){
		return Jails.components[ name ] = function ( html, data ){
			var component = new Component( name, html );
			var newcomponent = Mixin( component, html, data );
			return newcomponent? Object.assign( component, newcomponent ) : component;
		};
	}

	Jails.events = on();
	Jails.publish = publisher.publish;
	Jails.subscribe = publisher.subscribe;

	Jails.data = {};

	Jails.Component  = Component;
	Jails.components = {};

	Jails.start = function( ctx ){
		Jails.scanner.scan( ctx );
		Jails.publish('jails:ready');
	};

	Jails.refresh = function( ctx ){
		Jails.scanner.scan( ctx );
	};

	Jails.render = function( container, html ){
		Jails.scanner.scan( container, function( element ){
			Jails.events.trigger( element, 'destroy');
		});
		container.innerHTML = html;
	};

	Jails.scanner = {

		entities :{

			components :{
				selector:'[data-component]',
				method 	:component
			}
		},

		scan :function( context, callback ){

			var current, list, entities = this.entities, ctx;
			ctx = context || document;
			for( var entity in entities ){
				current = entities[ entity ];
				list = slice.call(ctx.querySelectorAll( current.selector ));
				forEach(list.reverse(), callback || current.method);
			}
		}
	};

	function Component( name, element ){

		this.name = name;
		this.element = element;
		this._events = {};

		Jails.events.on(element, 'execute', execute(this, name));
		Jails.events.on(element, 'destroy', destroy(this));
	}

	Component.prototype.trigger = function( ev, target, args ){
		if( target && target.constructor == String ){
			forEach(this.element.querySelectorAll(target), function(children){
				Jails.events.trigger(children, ev, args );
			});
		}else{
			Jails.events.trigger( this.element, ev, args );
		}
	};

	Component.prototype.emit = function( simbol, args ){
		args._instance = this;
		Jails.events.trigger( this.element, simbol, args );
	};

	Component.prototype.listen = function( ev, method ){

		var element = this.element,
			oldev = ev.split(':'),
			name = oldev.shift();

		Jails.events.on( element, oldev.pop(), handler );

		function handler(e){

			var instance = e.detail._instance;
			delete e.detail._instance;

			if( starregex.test(name) || name == instance.name ){
				method.call(e.target, e, e.detail);
			}
		}

		return function(){
			Jails.events.off( element, ev, handler);
		};
	};

	Component.prototype.on = function( ev, query, method ){

		if(!method){
			method = query;
			query = null;
		}

		var element = this.element;
		var events = this._events;

		events[method] = function(e){
			if(!query) return method.call(element, e);
			else{
				var target = e.target;
				while( target && target != element && target.parentNode ){
					if ( target.matches? target.matches(query) :matchesSelector(target, query) ){
						method.call(target, e);
						break;
					}
					target = target.parentNode;
				}
			}
		};

		Jails.events.on( element, ev, events[method] );
		//Off
		return function(){
			Jails.events.off( element, ev, events[method] );
			delete events[method];
		};
	};

	Component.prototype.publish = publisher.publish;
	Component.prototype.subscribe = publisher.subscribe;

	Component.prototype.get = function( query ){

		var element = this.element;
		query = query.replace(/\//g, '\\/');

		function x( target ){
			return function(){
				var args = slice.call( arguments );
				forEach(element.querySelectorAll(target), function(children){
					Jails.events.trigger(children, 'execute', args );
				});
				Jails.events.trigger(element, 'execute', args );
			};
		}

		return x( query );
	};

	function component( element ){
		var instance,
			anno = annotations( element ),
			names = element.getAttribute('data-component').split(/\s/);

		forEach( names, init );

		function init( name ){
			if( name in Jails.components ){
				if( instantiated( element, name) )
					return;
				instance = Jails.components[name](element, anno[name] || {});
				if( instance.init )
					instance.init();
			}
		}
	}

	function instantiated( element, name ){
		var setted = element['jails#component#'+name];
		if( setted ) return true;

		element['jails#component#'+name] = true;
		return false;
	}

	function annotations( el ){

		var ann = {}, comment, code;

		comment = el.previousSibling;
		comment = comment && comment.nodeType == 8? comment :comment? comment.previousSibling : null;

		if(comment && comment.nodeType == 8){
			code = comment.data
				.replace(/[\n\t]/g, '')
				.replace(/\@([a-zA-z0-9-\/]*)\(([^@]*)\)/g, function( text, component, param ){
					ann[component] = new Function('return '+ param)();
				});
		}

		return ann;
	}

	function execute( instance, name ){

		return function(e){

			if(e.detail){
				var d, n, namespace, method;
					d = dup( e.detail );
					n = d.shift();
					namespace = n.split(/\:/);

				if( namespace.length > 1 && namespace[0] == name)
					method = instance[ namespace[1] ];
				else
					method = instance[ namespace[0] ];

				if( method ) method.apply(instance, d);
			}

			e.stopPropagation();
		};
	}

	function destroy( instance ){
		return function(e){
			for(var i in instance._events)
				Jails.events.off(instance.element, instance._events[i]);
			for( i in instance )
				instance[i] = null;
			instance = null;
			e.stopPropagation();
		};
	}

	//Inspired by:
	//http://dev.housetrip.com/2014/09/15/decoupling-javascript-apps-using-pub-sub-pattern/
	function pubsub(){

		var topics = {};
		var _async = {};

		return{

			subscribe :function(){

				var args = slice.call( arguments );
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

					forEach(topics[key], function( fn){
						if(fn != method)
							newarr.push(fn);
					});
					topics[key] = newtopics;

					forEach(_async[key], function( fn){
						if(fn != method)
							newarr.push(fn);
					});
					_async[key] = newasync;
				};
			},

			publish :function(){

				var args = slice.call( arguments );
				var key = args.shift();

				topics[key] = topics[key] || [];

				if(!topics[key].length){
					_async[key] = args;
				}

				else forEach(topics[key], function( f ) {
					if( f ) f.apply( this, args );
				});
			}
		};
	}

	function on(){

		//http://gist.github.com/jonathantneal/7366668
		var CustomEv = (function(){
			try {
				var p = new CustomEvent('c', { detail: { foo: 'b' } });
				if('c' === p.type && 'b' === p.detail.foo)
					return CustomEvent;
			} catch (e) {
				return function(type, params) {
					var e = document.createEvent('CustomEvent');
					params = params || {};
					e.initCustomEvent(type, params.bubbles || false, params.cancelable || false, params.detail || null);
					return e;
				};
			}
		})();

		function Ev(type, params) {
			var e = document.createEvent(type);
			params = params || {};
			e.initEvent(type, params.bubbles || false, params.cancelable || false, params.detail || null);
			return e;
		}

		return {

			on :(function(){
				return function(el, e, fn){
					el.addEventListener(e, fn, (e == 'focus' || e == 'blur'));
				};
			})(),

			off :function(el, event, fn){
				el.removeEventListener(event, fn, false);
			},

			trigger :function(el, name, args){
				try{
					el.dispatchEvent( new Ev( name, { bubbles :true, detail :args } ) );
				}catch(e){
					el.dispatchEvent( new CustomEv( name, { bubbles :true, detail :args } ) );
				}
			}
		};
	}

	function forEach(array, fn){
		for(var i = 0, len = array? array.length :0; i < len; i++)
			fn(array[i], i);
	}

	function dup(o){
		var f = function(){};
		f.prototype = o;
		return new f();
	}

	// http://tanalin.com/en/blog/2012/12/matches-selector-ie8/
	function matchesSelector(elem, selector) {

		var elems = elem.parentNode.querySelectorAll(selector),
			count = elems.length;

		for (var i = 0; i < count; i++) {
			if (elems[i] === elem) {
				return true;
			}
		}

		return false;
	}

	if ( !Object.assign ) {
		Object.assign = function(target) {
			target = Object( target );
			for ( var index = 1, len = arguments.length; index < len; index++) {
				var source = arguments[index];
				if ( source != null ) {
					for ( var key in source) {
						if ( Object.prototype.hasOwnProperty.call(source, key) ) {
							target[key] = source[key];
						}
					}
				}
			}
			return target;
		};
	}

	return Jails;
}));

define(function(){

	var Jails, config, global = {}, publisher = PubSub(), slice, Event;

	slice = Array.prototype.slice;

	Jails = {

		context		:null,
		apps 		:{},
		controllers	:{},
		components 	:{},

		app 		:_Class('apps', Controller),
		controller 	:_Class('controllers', Controller),
		component	:_Class('components', Component),

		publish 	:publisher.publish,
		subscribe 	:publisher.subscribe,

		start :function( ctx ){

			Scanner.scan( ctx );
			document.documentElement.className += 'ready';
		},

		refresh :function( ctx ){
			Scanner.scan( ctx );
		},

		data :function(){
			return global;
		},

		scanner :function(){
			return Scanner;
		}
	};

	var Scanner = {

		scan :function( context ){

			var current, list, entities = this.entities;

			for( var entity in entities ){
				current = entities[ entity ];
				list = slice.call( (context || document).querySelectorAll( current.selector ) );
				list.forEach( current.method );
			}
		},

		entities :{

			components :{
				selector:'[data-component]',
				method 	:component
			},

			controllers:{
				selector:'[data-controller]',
				method 	:controller('controller')
			},

			app :{
				selector :'[data-app]',
				method	 :controller('app')
			}
		}
	};

	function create( T, Class, name, element, data ){
		var object = new T( name, element );
		if( Class ) Class.apply( object, [element, data] );
		if( object.init ) object.init();
	}

	function component( element ){

		var anno = annotations( element ),
		names = element.getAttribute('data-component').replace(/\s/, '').split(/\,/);

		names.forEach( init );

		function init( item ){
			if( item in Jails.components ){
				create( Component, Jails.components[ item ], item, element, anno[item] || {} );
			}
		}
	}

	function annotations( el ){

		var ann = {}, comment, code;

		comment = el.previousSibling;
		comment = comment? comment.previousSibling :null;

		if(comment && comment.nodeType == 8){
			code = comment.data
				.replace(/[\n\t]/g, '')
				.replace(/\@([a-zA-z0-9-]*)\(([^@]*)\)/g, function( text, component, param ){
					ann[component] = new Function('return '+ param)();
				});
		}

		return ann;
	}

	function controller( T ){
		return function( element ){
			var name, object;
			name = element.getAttribute( 'data-' + T );
			create( Controller, Jails[ T + 's' ][name], name, element, global);
		};
	}

	function Component(name, element){

		this.name = name;
		var instance = this;

		element.addEventListener('execute', execute);

		this.emit = function( simbol, args ){
			element.dispatchEvent( new Event( name + ':' + simbol, { bubbles :true, detail :args } ) );
		};

		this.listen = function( name, method ){
			element.addEventListener( name, function(e){
				method.call(e.target, e, e.detail || {});
			});
		};

		function execute(e){
			var d = e.detail;
			if(d){
				var method = instance[d.shift()];
				if(method) method.apply(instance, d);
			}
		}
	}

	function Controller( name, element ){

		Component.apply( this, arguments );

		this.publish = publisher.publish;
		this.subscribe = publisher.subscribe;

		this.watch = function(query, ev, method){

			element.addEventListener(ev, function(e){
				var target = e.target;
				while( target && target != element && target.parentNode ){
					if (target == target.parentNode.querySelector(query))
						method.call(target, e);
					target = target.parentNode;
				}
			});
		};

		this.x = function(target){
			return function(){
				var args = slice.call( arguments );
				[].forEach.call( element.querySelectorAll(target), function(children){
					children.dispatchEvent( new Event( 'execute', { detail :args } ) );
				});
			};
		};
	}

	function _Class( t, T ){
		return function( name, Subclass ){
			Jails[ t ][ name ] = Subclass;
			return function( element, data ){
				T.apply( this, [name, element] );
				Subclass.apply( this, [element, data] );
			};
		};
	}

	//Inspired by:
	//http://dev.housetrip.com/2014/09/15/decoupling-javascript-apps-using-pub-sub-pattern/
	function PubSub(){

		var topics = {};

		return{

			subscribe :function(){

				var args = slice.call( arguments );
				var key = args[0], method = args[1];

				topics[key] = topics[key] || [];
				topics[key].push( method );
			},

			publish :function(){

				var args = slice.call( arguments );
				var key = args.shift();

				topics[key] = topics[key] || [];
				topics[key].forEach(function( f ) {
					if( f ) f.apply( this, args );
				});
			}
		};
	}

	Event = (function(){

		try {
			var p = new CustomEvent('c', { detail: { foo: 'b' } });
			if('c' === p.type && 'b' === p.detail.foo)
				return CustomEvent;
		} catch (e) {
			return 'function' === typeof document.createEvent ? function(type, params) {
				var e = document.createEvent('CustomEvent');
				params = params || {};
				e.initCustomEvent(type, params.bubbles || false, params.cancelable || false, params.detail || null);
				return e;
			} :function(type, params) {
				var e = document.createEventObject();
				e.type = type;
				if (params) {
					e.bubbles = Boolean(params.bubbles);
					e.cancelable = Boolean(params.cancelable);
					e.detail = params.detail;
				} else {
					e.bubbles = false;
					e.cancelable = false;
					e.detail = void 0;
				}
				return e;
			};
		}

	})();

	return Jails;
});

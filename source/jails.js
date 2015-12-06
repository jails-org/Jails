define(function(){

	var Jails, config, global = {}, publisher = PubSub(), slice;

	slice = Array.prototype.slice;

	Jails = {

		apps 		:{},
		controllers	:{},
		components	:{},
		events 		:On(),

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
		},

		render :function( container, html ){
			Scanner.scan(container, function(item){
				Jails.events.trigger(item, 'execute', 'destroy' );
			});
			container.innerHTML = html;
		}
	};

	var Scanner = {

		scan :function( context, callback ){

			var current, list, entities = this.entities, ctx;
			ctx = context || document;
			for( var entity in entities ){
				current = entities[ entity ];
				list = ctx.querySelectorAll( current.selector );
				forEach(list, callback || current.method);
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

		var instantiated = element['jails-'+name];
		if( instantiated ) return;

		element['jails-'+name] = true;

		var object = new T( name, element );
		if( Class ) Class.apply( object, [element, data] );
		if( object.init ) object.init();
	}

	function component( element ){

		var anno = annotations( element ),
		names = element.getAttribute('data-component').replace(/\s/, '').split(/\,/);

		forEach(names, init);

		function init( item ){
			if( item in Jails.components ){
				create( Component, Jails.components[ item ], item, element, anno[item] || {} );
			}
		}
	}

	function annotations( el ){

		var ann = {}, comment, code;

		comment = el.previousSibling;
		comment = comment && comment.nodeType == 8? comment :comment?comment.previousSibling:null;

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

	function Common(name, element){

		var instance = this;

		this.name = name;
		this.trigger = Jails.events.trigger;

		Jails.events.on(element, 'execute', execute);

		this.emit = function( simbol, args ){
			Jails.events.trigger( element, name+':'+simbol, args );
		};

		this.on = function(ev, query, method){

			if(!method){
				method = query;
				query = null;
			}

			Jails.events.on(element, ev, function(e){
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
			});
		};

		function execute(e){

			if(e.detail){
				var d = dup(e.detail);
				var method = instance[d.shift()];
				if(method) method.apply(instance, d);
			}

			e.stopPropagation();
		}
	}

	function Component(name, element){
		Common.apply(this, arguments);
	}

	function Controller( name, element ){

		Common.apply( this, arguments );

		this.publish = publisher.publish;
		this.subscribe = publisher.subscribe;

		this.listen = function( ev, method ){
			Jails.events.on( element, ev, function(e){
				method.call(e.target, e, e.detail);
			});
		};

		this.x = function(target){
			return function(){
				var args = slice.call( arguments );
				forEach(element.querySelectorAll(target), function(children){
					Jails.events.trigger(children, 'execute', args );
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

	function forEach(array, fn){
		for(var i = 0, len = array.length; i < len; i++)
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

	function On(){

		//http://gist.github.com/jonathantneal/7366668
		var hasfocusin = (function() {
				var
				support = false,
				parent = document.lastChild,
				a = document.createElement('a'),
				addSupport = function () {
					support = true;
				};
				a.href = '#';
				a.addEventListener ? a.addEventListener('focusin', addSupport) : a.onfocusin = addSupport;
				parent.appendChild(a).focus();
				parent.removeChild(a);
				return support;
		})();

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
				return hasfocusin? function(el, e, fn){
					var newe = e == 'focus'? 'focusin' :e == 'blur'? 'focusout':e;
					el.addEventListener(newe, fn, false);
				}:function(el, e, fn){
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

	return Jails;
});

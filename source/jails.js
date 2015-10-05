define(function(){

	var Jails, config, $, global = {}, publisher = PubSub(), slice;

	slice = Array.prototype.slice;

	Jails = {

		context		:null,
		config 		:{},

		apps 		:{},
		controllers	:{},
		components 	:{},

		app 		:_Class('apps', Controller),
		controller 	:_Class('controllers', Controller),
		component	:_Class('components', Component),

		publish 	:publisher.publish,
		subscribe 	:publisher.subscribe,

		start :function( cfg, ctx ){

			$ = cfg.base;
			this.context = $( document.documentElement );

			$.extend( true, this.config, cfg );
			Scanner.scan( ctx );
			this.context.addClass('ready');
		},

		refresh :function( ctx ){
			Scanner.start( ctx.get? ctx[0] :ctx );
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
		var el = $( element ), object = new T( name, el );
		if( Class ) Class.apply( object, [el, data] );
		if( object.init ) object.init();
	}

	function component( element ){

		var names = element.getAttribute('data-component').replace(/\s/, '').split(/\,/);
			names.forEach( init );

		function init( item ){
			if( item in Jails.components ){
				create( Component, Jails.components[ item ], item, element );
			}
		}
	}

	function controller( T ){
		return function( element ){
			var name, object;
			name = element.getAttribute( 'data-' + T );
			create( Controller, Jails[ T + 's' ][name], name, element, global);
		};
	}

	function Component( name, element ){
		Common.apply( this, arguments );
	}

	function Common(name, element){

		var _self = this;

		this.name = name;

		this.emit = function( simbol, args ){
			args = slice.call( arguments );
			args.shift();
			element.trigger(name+':'+simbol, { args :args, element :element[0] });
		};

		this.listen = function(name, method){
			if( method ){
				element.on(name, function(e, o){
					method.apply(o.element, [e].concat(o.args));
				});
			}
			else for(var i in name){
				_self.listen(i, name[i]);
			}
		};

		element.on('execute', function(e, o){

			var
				newargs = [].concat(o.args),
				n = newargs.shift(),
				method = _self[n];

			if( method ) method.apply(_self, newargs);
			e.stopPropagation();
		});

		element.on('instance', function(e, callback){
			callback.call(_self, name, element);
		});
	}

	function Controller( name, element ){

		Common.apply( this, arguments );

		var dom = element[0];

		this.watch = function(target, ev, method){
			element.on(ev, target, method);
		};

		this.x = function(target){
			return function(){
				var args = slice.call( arguments );
				element.find(target).trigger('execute', {args :args});
			};
		};

		this.publish = function(simbol, args){
			args = slice.call(arguments);
			args.shift();
			publisher.trigger(simbol, { args :args, element :dom });
		};

		this.subscribe = function(name, method){
			publisher.on(name, function(e, o){
				method.apply(o.element, [e].concat(o.args));
			});
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

	function _Class( t, T ){
		return function( name, Subclass ){
			Jails[ t ][ name ] = Subclass;
			return function( element, data ){
				T.apply( this, [name, element] );
				Subclass.apply( this, [element, data] );
			};
		};
	}

	return Jails;
});

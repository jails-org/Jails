define(function(){

	var jails, config, $, global = {}, publisher = PubSub(), slice;

	slice = Array.prototype.slice;

	jails = {

		context:null,
		config 		:{},
		apps 		:{},
		controllers :{},
		components 	:{},

		app			:create('app'),
		controller	:create('controller'),
		component	:create('component'),

		publish 	:publisher.publish,
		subscribe 	:publisher.subscribe,

		start :function(cfg, ctx){

			$ = cfg.base;
			jails.context = $( document.documentElement );

			$.extend( true, jails.config, cfg );
			Scanner.start( ctx );
			jails.context.addClass('ready');
		},

		refresh :function(ctx){
			Scanner.start( ctx );
		},

		data :function(){
			return global;
		},

		scanner :function(){
			return Scanner;
		}

	};

	var Scanner = {

		start :function(context){

			var modules = [];

			context = context || jails.context;

			Scanner.scan( 'component', '[data-component]', context, modules);
			Scanner.scan( 'controller', '[data-controller]', context, modules);
			Scanner.scan( 'app', '[data-app]', context, modules );

			Module.start( modules );
		},

		scan :function( name, query, context, modules ){

			context = context || jails.context;
			var el, els, len, scan;

			els = context.get(0).querySelectorAll(query);
			len = els.length;

			for(var i = 0; i < len; i++){
				el = $(els[i]);
				scan = Scanner[name];
				scan? scan(name, el, modules) :Scanner.module( name, el, modules );
			}
		},

		module :function(type, el, modules){

			var name, object, m, sufix = 's';
			name = el.data(type);

			m = jails[ type + sufix ][ name ];
			m = m? new m( el, global ) :new Module[ type ]( name, el, type );

			modules.push( m );
		},

		component :function(type, el, modules){

			var name, components, object, m, anno;

			name = el.data(type);
			anno = Scanner.annotations( name, el );
			components = name.replace(/\s/g, '').split(/\,/);

			$.each( components, function(i, n){

				m = jails.components[n];
				m = m? new m( el, n in anno? anno[n]:{} ) :new Module[type]( n, el );

				modules.push( m );
			});
		},

		annotations :function( name, el ){

			var ann = {}, comment, code;

			comment = el.get(0).previousSibling;
			comment = comment? comment.previousSibling :null;

			if(comment && comment.nodeType == 8){
				code = comment.data
					.replace(/[\n\t]/g, '')
					.replace(/\@([a-zA-z0-9-]*)\(([^@]*)\)/g, function(text, component, param){
						ann[component] = new Function('return '+ param)();
					});
			}
			return ann;
		}

	};

	var Module = {

		start :function(modules){

			var len = modules.length;
			for(var i = 0; i < len; i++){
				if( modules[i].init ){
					modules[i].init();
				}
			}

			modules = null;
		},

		common :function(name, element){

			var _self = this;

			this.name = name;

			this.emit = function( simbol, args ){
				args = slice.call(arguments);
				args.shift();
				element.trigger(name+':'+simbol, { args :args, element :element.get(0) });
			};

			this.listen = function(name, method){
				if( method )
					element.on(name, function(e, o){
						method.apply(o.element, [e].concat(o.args));
					});
				else for(var i in name){
					_self.listen(i, name[i]);
				}
			};

			element.on('execute', function(e, o){

				var
					newargs = [].concat(o.args),
					n = newargs.shift(),
					method = _self[n];

				if( method )
					method.apply(_self, newargs);

				e.stopPropagation();
			});

			element.on('instance', function(e, callback){
				callback.call(_self, name, element);
			});
		},

		app :function( name, element ){

			Module.common.apply(this, arguments);

			var dom = element.get(0);

			this.publish = publisher.publish;
			this.subscribe = publisher.subscribe;

			this.watch = function(target, ev, method){
				element.on(ev, target, method);
			};

			this.x = function(target){
				return function(){
					var args = slice.call( arguments );
					element.find(target).trigger('execute', {args :args});
				};
			};

			this.emit = function( simbol, args ){
				args = slice.call(arguments);
				args.shift();
				element.trigger(name+':'+simbol, { args :args, element :dom });
			};

		},

		component :function( name, element ){
			Module.common.apply( this, arguments );
		}
	};

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

	function create( type ){

		var _class = type != 'component' ? 'app' :type;

		return function(name, method){

			if( this instanceof jails[ type ] ){
				Module[ _class ].call(this, arguments[2], arguments[1]);
			}else{
				return jails[ type+'s' ][ name ] = function( element, global ){
					Module[ _class ].call( this, name, element );
					method.call(this, element, global);
				};
			}
		};
	}

	return jails;
});

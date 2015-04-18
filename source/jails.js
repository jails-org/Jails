define(function(){

	var
		Jails, config, $, global = {}, publisher, slice;

	slice = Array.prototype.slice;

	Jails = {

		config :{ templates :{ type :'x-tmpl-mustache'} },
		context:null,

		start :function(cfg, ctx){

			$ = cfg.base;
			Jails.context = $( document.documentElement );
			publisher = $('<i />');

			$.extend( true, Jails.config, cfg );
			Scanner.start( ctx );
			Jails.context.addClass('ready');
		},

		refresh :function(ctx){
			Scanner.start( ctx );
		},

		data :function(){
			return global;
		}

	};

	var Scanner = {

		start :function(context){

			var type, modules = [];

			context = context || Jails.context;
			type = Jails.config.templates.type;

			Scanner.scan( 'partial', 'script[type='+type+']', context, modules);
			Scanner.scan( 'component', '[data-component]', context, modules);
			Scanner.scan( 'controller', '[data-controller]', context, modules);
			Scanner.scan( 'app', '[data-app]', context, modules );

			Module.start( modules );
		},

		scan :function( name, query, context, modules ){

			context = context || Jails.context;
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

			m = Jails[ type + sufix ][ name ];
			m = m? new m( el, global ) :new Module[ type ]._class( name, el, type );

			modules.push( m );
		},

		partial :function(type, el){

			var cfg = Jails.config.templates.prefix;
			var name = el.prop('id').split( cfg || 'tmpl-').pop();

			Jails.templates[name] = $.trim( el.html() );
		},

		component :function(type, el, modules){

			var name, components, object, m, anno;

			name = el.data(type);
			anno = Scanner.annotations( name, el );
			components = name.replace(/\s/g, '').split(/\,/);

			$.each( components, function(i, n){

				m = Jails.components[n];
				m = m? new m( el, n in anno? anno[n]:{} ) :new Module[type]._class( n, el );

				modules.push( m );
			});
		},

		annotations :function( name, el ){

			var ann = {}, comment, code;

			comment = el.get(0).previousSibling;
			comment = comment? comment.previousSibling :null;

			if(comment && comment.nodeType == 8){
				code = comment.data.replace(/\@(.*)\((\{.*\})\)/g, function(text, component, param){
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

		common :{

			_class :function(name, element){

				var _self = this;

				this.name = name;

				element.on('execute', function(e, o){

					var
						newargs = [].concat(o.args),
						n = newargs.shift(),
						method = _self[n];

					if( method )
						method.apply(_self, newargs);
					else
						console.warn('Jails@warning =>', name, 'has no method :', n);
					e.stopPropagation();
				});
			}
		},

		app :{

			_class :function( name, element ){

				Module.common._class.apply(this, [name, element]);

				var dom = element.get(0);

				this.watch = function(target, ev, method){
					element.on(ev, target, method);
				};

				this.x = function(target){
					target = element.find(target);
					return function(){
						var args = slice.call( arguments );
						target.trigger('execute', {args :args});
					};
				};

				this.listen = function(name, method){
					element.on(name, function(e, o){
						method.apply(o.element, [e].concat(o.args));
					});
				};

				this.emit = function( simbol, args ){
					args = slice.call(arguments);
					args.shift();
					element.trigger(name+':'+simbol, { args :args, element :dom });
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
		},

		controller :{

			_class :function( name, element ){

				Module.app._class.apply(this, [name, element]);
			}
		},

		model :{

			_class :function( name, element ){

				var
					data = {}, _self = this;

				this.name = name;

				this.data = function(response, id){
					if(response){
						data = response;
						if(id){
							data = this.transform(id, response);
						}
						$? $(this).trigger('change', data) :null;
					}
					else return data;
				};

				this.on = function(action, method){
					$(this).on(action, function(e, o){
						method.call(this, o);
					});
				};

				this.trigger = function(action, params){
					$(this).trigger(action, params);
				};

				this.find = function(id){
					return data[id];
				};

				this.remove = function(id){
					delete data[id];
					this.trigger( 'change', data );
				};

				this.update = function(id, value){
					data[id] = value;
					this.trigger( 'change', data );
				};

				this.to_array = function(){
					return $.map( data, function(item){ return [item]; });
				};

				this.transform = function(primary, response){

					response = response || data;
					response = response.push? response :[ response ];
					var json = {}, l = response.length, i, item;

					for(i = 0; i < l; i++){
						item = response[i];
						json[ item[primary || i] ] = item;
					}

					count = i;
					return json;
				};
			}
		},

		component :{

			_class :function( name, element ){

				var _self = this;

				Module.common._class.apply(this, [name, element]);

				this.emit = function( simbol, args ){
					args = slice.call(arguments);
					args.shift();
					element.trigger(name+':'+simbol, { args :args, element :element.get(0) });
				};

				this.listen = function(name, method){
					element.on(name, function(e, o){
						method.apply(o.element, [e].concat(o.args));
					});
				};
			}
		}
	};

	var Interface = {

		_class :function(){

			this.apps = {};
			this.controllers = {};
			this.models = {};
			this.components = {};
			this.templates = {};
			this.filters = {};

			this.template = {

				promises:{},

				load :function(url, name){

					var p, template, t, l;
					name = name || filename(url);
					template = Jails.templates;
					t = template[name];
					pm = this.promises[name];

					if(t) return t;
					if(pm) return pm;

					l = $.get(url).done(function(tpl){ template[name] = tpl; });
					this.promises[name] = l;

					return l;
				}
			};

			this.controller = function(name, method){
				return create.call(this, 'controller', name, method);
			};

			this.component = function(name, method){
				create.call(this, 'component', name, method);
			};

			this.app = function(name, method){
				create.call(this, 'app', name, method);
			};

			this.filter = function(name, method){

				this.filters[name] = function(){
					return function(text, render){
						return method( render(text) );
					};
				};
			};

			this.model = function(name, method){

				if(this instanceof Jails.model){
					Module.model._class.call(this, name);
				}else{
					Jails.models[ name ] = method;
					var model = new Module.model._class(name);
					method.apply(model);
					return model;
				}
			};

			//Default Filters
			this.filter('out', function(text){
				var h = $(text), aux  = $('<div />'), script = h.data('out');
					h.html((new Function('return ' +script))());
					aux.append(h);
				return aux.html();
			});

			function create(type, name, method){
				if(this instanceof Jails[type])
					Module[type]._class.call( this, arguments[2], arguments[1] );
				else return this[type+'s'][ name ] = function(element, global){
					Module[type]._class.call( this, name, element );
					method.call(this, element, global);
				};
			}
		}
	};

	function filename(url){
		return url.split(/\//).pop().split(/\./).shift();
	}

	Interface._class.apply( Jails );
	return Jails;

});

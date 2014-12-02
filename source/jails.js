define(function(){

	var
		Jails, config, $, publisher, global = {};

	Jails = {

		config :{ templates :{ type :'x-tmpl-mustache'} },
		context:null,

		start :function(cfg, ctx){

			$ = cfg.base;
			Jails.context = $( document.documentElement );
			publisher = $('<i />');

			$.extend( true, Jails.config, cfg );
			Scanner.start( ctx );
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
			Scanner.scan( 'view', '[data-view]', context, modules);
			Scanner.scan( 'controller', '[data-controller]', context, modules);
			Scanner.scan( 'app', '[data-app]', context, modules );

			Module.start( modules );
		},

		scan :function(name, query, context, modules){

			context = context || Jails.context;
			var el, els, len, scan;

			els = context.get(0).querySelectorAll(query);
			len = els.length;

			for(var i = 0; i < len; i++){
				el = $(els[i]);
				scan = Scanner[name];
				scan?
					scan(name, el, modules) :Scanner.module( name, el, modules );
			}
		},

		module :function(type, el, modules){

			var name, object, m, sufix = 's';
			name = el.data(type);

			object = new Module[ type ]._class( name, el, type );

			m = Jails[type+sufix][ name ];
			m? m.apply( object, [el, global] ) :null;

			modules.push( object );
		},

		partial :function(type, el){

			var cfg = Jails.config.templates.prefix;
			var name = el.prop('id').split( cfg || 'tmpl-').pop();

			Jails.templates[name] = $.trim( el.html() );
		},

		component :function(type, el, modules){

			var name, components, object, m;

			name = el.data(type);
			components = name.replace(/\s/g, '').split(/\,/);

			$.each( components, function(i, n){

				object = new Module[type]._class( n, el );
				m = Jails.components[n];
				m? m.apply( object, [el] ) :null;

				modules.push( object );
			});
		}

	};

	var Module = {

		start :function(modules){

			var len = modules.length;
			for(var i = 0; i < len; i++)
				if( modules[i].init ) modules[i].init();

			modules = null;
		},

		common :{

			_class :function(name, element){

				var _self = this;

				this.name = name;

				element.on('get-instance', function(e, getter){
					getter( _self );
					e.stopPropagation();
				});

				this.get = function(type, query){

					var el;
					if(query) el = element.find('[data-'+type+'*="'+query+'"]');
					else el = element.find('[data-'+type+']');

					return Entity( el );
				};

				this.data = function(data){
					return data? global = data :global;
				};

				this.watch = function(target, ev, method){
					element.on(ev, target, method);
				};

				this.broadcast = function(target, ev){
					$(target).trigger(ev);
				};

				this.listen = function(name, method){
					publisher.on(name, function(e, o){
						method.apply(o.element, [e].concat(o.args));
					});
				};

				this.emit = function( simbol, args ){
					args = Array.prototype.slice.call(arguments);
					args.shift();
					publisher.trigger(name+':'+simbol, { args :args, element :element.get(0) });
				};
			}
		},

		app :{

			_class :function( name, element ){
				Module.common._class.apply(this, [name, element]);
			}
		},

		controller:{

			_class :function( name, element ){
				Module.common._class.apply(this, [name, element]);
			}
		},

		view :{

			_class :function( name, element ){

				Module.common._class.apply(this, [name, element]);

				var tpl, cfg, templates, render, _self = this;

				tpl = element.data('template');
				render = element.data('render');

				cfg = Jails.config.templates;
				templates = Jails.templates;

				this.template = function(vo, tpl){
					return cfg.engine.render( get(tpl), vo, templates );
				};

				this.render = function(vo, template){
					tpl = template || tpl;
					if(tpl && templates[tpl])
						this.partial(element, tpl, vo);
				};

				this.partial = function(el, tpl, vo){

					if(templates[tpl]){

						var html = cfg.engine.render( get(tpl), vo, templates );

						el.html( html );
						Scanner.start(el);
					}
				};

				function get(name){
					return templates[name];
				}

				render? this.render({}) :null;
			}
		},

		model :{

			_class :function( name, element ){

				var
					data, _self = this;

				this.name = name;

				this.on_update = function(){};

				this.data = function(response, id){
					if(response){
						data = response;
						if(id) this.transform(id, response);
						this.on_update(data);
					}
					else return data;
				};

				this.size = function(){
					var count = 0;
					for(var i in data) count++;
					return count;
				};

				this.find = function(id){
					return data[id];
				};

				this.remove = function(id){
					delete data[id];
					this.on_update( data );
				};

				this.update = function(id, value){
					data[id] = value;
					this.on_update( data );
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
					data = json;
				};
			}
		},

		component :{

			_class :function( name, element ){

				this.name = name;
				var _self = this;

				element.on('get-instance', function(e, getter){
					getter( _self );
					e.stopPropagation();
				});

				this.emit = function( simbol, args ){
					args = Array.prototype.slice.call(arguments);
					args.shift();
					element.trigger(name+':'+simbol, { args :args, element :element.get(0) });
				};
			}
		}
	};

	function Entity(dom){

		function instance(el){

			var object;
			el.trigger('get-instance', function(instance){ object = instance; });

			return object || {};
		}

		return {

			execute :function(method, args){

				args = Array.prototype.slice.call(arguments);
				args.shift();

				var object = instance( dom.eq(0) );
				if( object[method] ) object[method].apply( object, args );
			},

			broadcast :function(method, args){

				args = Array.prototype.slice.call(arguments);
				args.shift();

				dom.each(function(){
					var object = instance( $(this) );
					if( object[method] ) object[method].apply( object, args );
				});
			},

			instance :function(){
				return instance( dom.eq(0) );
			}
		};
	}

	var Interface = {

		_class :function(){

			this.apps = {};
			this.controllers = {};
			this.views = {};
			this.models = {};
			this.components = {};
			this.templates = {};

			this.controller = function(name, method){
				this.controllers[ name ] = method;
			},

			this.component = function(name, method){
				this.components[ name ] = method;
			},

			this.view = function(name, method){
				this.views[ name ] = method;
			},

			this.app = function(name, method){
				this.apps[ name ] = method;
			},

			this.model = function(name, method){

				Jails.models[ name ] = method;

				var model = new Module.model._class(name);
				method.apply(model);

				return model;
			}
		}
	};

	Interface._class.apply( Jails );
	return Jails;

});

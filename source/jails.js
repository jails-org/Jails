define(function(){

	var
		Jails, config, $, global = {}, publisher;

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

			var name, components, object, m;

			name = el.data(type);
			components = name.replace(/\s/g, '').split(/\,/);

			$.each( components, function(i, n){

				m = Jails.components[n];
				m = m? new m( el ) :new Module[type]._class( n, el );

				modules.push( m );
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

				this.watch = function(target, ev, method){
					element.on(ev, target, method);
				};

				this.broadcast = function(target, ev){
					$(target).trigger(ev);
				};

				this.listen = function(name, method){
					element.on(name, function(e, o){
						method.apply(o.element, [e].concat(o.args));
					});
				};

				this.emit = function( simbol, args ){
					args = Array.prototype.slice.call(arguments);
					args.shift();
					element.trigger(name+':'+simbol, { args :args, element :element.get(0) });
				};

				this.publish = function(simbol, args){
					args = Array.prototype.slice.call(arguments);
					args.shift();
					publisher.trigger(simbol, { args :args, element :element.get(0) });
				};

				this.subscribe = function(name, method){
					publisher.on(name, function(e, o){
						method.apply(o.element, [e].concat(o.args));
					});
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

				cfg = Jails.config.templates;
				templates = Jails.templates;

				tpl = get(element.data('template')) || generate(element);
				render = element.data('render');

				this.template = function(vo, tmpl){
					return cfg.engine.render( get(tmpl), vo, templates );
				};

				this.render = function(vo, template){
					var tmpl = template || tpl;
					this.partial(element, tmpl, vo);
				};

				this.partial = function(el, tmpl, vo){

					var newvo, html;
					vo = vo || {};
					tmpl = templates[tmpl] || tmpl;

					if(vo && vo.done){
						vo.done(function(response){ _self.partial(el, tmpl, response); });
					}
					else{
						newvo = $.extend({}, vo, Jails.filters);
						html = cfg.engine.render( tmpl || tpl, newvo, templates );

						el.html( html );
						Scanner.start(el);
					}
				};

				function get(name){
					return name?templates[name] :null;
				}

				function generate(el){

					var html = el.html(), ch = $('<div />'), aux = $('<div />'), text;

					aux.append( html );

					aux.find('[data-if]').each(function(){
						var it = $(this), v = it.data('if');
						it.before('{{#'+v+'}}');
						it.after('{{/'+v+'}}');
					});

					aux.find('[data-not]').each(function(){
						var it = $(this), v = it.data('not');
						it.before('{{^'+v+'}}');
						it.after('{{/'+v+'}}');
					});

					aux.find('[data-each]').each(function(){
						var it = $(this), child = it.children().eq(0), name = it.data('each');
						ch.empty().append(child);
						it.html('{{#'+name +'}}'+ch.html()+'{{/'+name+'}}');
					});

					aux.find('[data-value]').each(function(){
						var it = $(this), name = it.data('value'), filter = name.split(/\:/);
						if(!filter[1]) it.html( '{{'+ name +'}}');
						else it.html('{{#'+filter[1]+'}}{{' +filter[0]+ '}}{{/'+filter[1]+'}}');
					});

					aux.find('[data-out]').each(function(){
						$(this).before('{{#out}}').after('{{/out}}');
					});

					//http://stackoverflow.com/questions/317053/regular-expression-for-extracting-tag-attributes
					return $.trim(aux.html().replace(/(data-attr)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g, function(a, b, c, d){
						return c;
					}));
				}

				render? this.render(global) :null;
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
						if(id) this.transform(id, response);
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
					this.trigger( 'change', data );
				};

				this.update = function(id, value){
					data[id] = value;
					this.trigger( 'change', data );
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
			this.filters = {};

			this.controller = function(name, method){
				return create.call(this, 'controller', name, method);
			};

			this.component = function(name, method){
				create.call(this, 'component', name, method);
			};

			this.view = function(name, method){
				create.call(this, 'view', name, method);
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

	Interface._class.apply( Jails );
	return Jails;

});

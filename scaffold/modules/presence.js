define(function(){

	var Presence = {

		_class :function(context, config){

			var deffered, _self = this, options;

			this.verbose = true;

			this.done = function(c){
				if( _self.verbose )
					console.log('Presence::done succeded.', c);
			};

			this.fail = function(c){
				if( _self.verbose )
					console.log('Presence::fail,', context.get(0), 'is missing => ', c);
			};

			this.init = function(cfg, ctx){

				options = {};
				config = cfg || config;
				context = ctx || context;

				deffered = $.Deferred();

				if( config.required ) required( config.required, options );
				if( config.optional ) optional( config.optional, options );

				deffered.done( done ).fail( fail );
				deffered.resolve( options );

				return this;
			};

			function done(c){
				_self.done.call(this, c, options);
			}

			function fail(c){
				_self.fail.call(this, c, options);
			}

			function required(hash, options){

				var r = find( hash );
				options.required = {};

				if(r.error){ deffered.reject( r.not_found ); }
				else{
					options.required = r.found;
				}
			}

			function optional(hash, options){

				var r = find( hash );
				options.optional = {};

				if(r.error){
					options.missing = r.not_found;
				}

				options.optional = r.found;
			}

			function find( hash ){

				var found = {}, not_found = {}, error = false, el;

				$.each(hash, function(key, value){

					el = context.find(value);

					if(el.length) found[key] = el;
					else{
						not_found[key] = el;
						error = true;
					}
				});

				return { error :error, not_found :not_found, found :found };
			}
		},

		create :function(context){
			return new this._class( context );
		},

		mixin :function(object, context){
			object.presence = this.create( context );
		}
	};

	return Presence;
});

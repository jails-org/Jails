define(function(){

	var Url = {

		_class :function(object){

			_interface.redirect.apply(this);

			var url = '';

			this.root = '#';

			this.get = function(uri){
				return uri ? uri.split(this.root).pop() :url.split(this.root).pop();
			};

			this.path = function(){
				return url;
			};

			this.redirect[ Object ] = function(json){
				this.redirect('', json);
			};

			this.redirect[ String ][1] = function(dest){

				if(!dest.replace)
					return this.redirect(this, '', dest);

				if(!url.match(/#/))
					url = url + this.root + dest;
				else
					url = url.split( this.root )[0] + this.root + dest;

				return location.href = url;
			};

			this.redirect[ String ][2] = function(dest, params){

				for(var i in params)
					dest += '/' + i + '/' + params[i];

				this.redirect(dest);
			};
		},

		create :function(o){
			return new this._class(o);
		}
	};

	var _interface = {

		redirect :function(){

			this.redirect = function(){
				return this.redirect[arguments[0].constructor].apply(this, arguments);
			};

			this.redirect[ Object ] = function(){
				return this.redirect[Object][arguments.length].apply(this, arguments);
			};

			this.redirect[ String ] = function(){
				return this.redirect[String][arguments.length].apply(this, arguments);
			};
		}
	};

	return Url.create();
});

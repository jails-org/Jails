define([ 'lib/jails' ],function(jails){

	jails.component('my-component', function(html){

		var _self = this;

		this.init = function(){
			html.text('my-component is loaded!');
		};

	});

});

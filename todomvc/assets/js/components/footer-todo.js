define(['jails'], function( jails ){

	jails.component('footer-todo', function(html){

		var cp = this;

		this.init = function(){
			html.find('button').on('click', clear);
		};

		function clear(){
			cp.emit('clear');
		}
	});
});

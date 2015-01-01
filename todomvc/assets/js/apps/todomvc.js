define([

	'jails',
	'mods/router/router',
	'mods/url/url',
	'models/todos',
	'controllers/todos'

], function( jails, router, url, todos){

	jails.app('todomvc', function(html, data){

		var
			r = router.create(),
			body = html.get(0),
			view = this.get('view', 'todos').instance();

		this.init = function(){

			if( !location.hash ) url.redirect('/');

			r.watch([
				{ '/:filter':filter },
				{ '/'		:filter }
			]);

			r.execute();
		};

		function filter( by ){

			by = by || 'all';

			view.render( todos.result( by ));
			body.className = by;
		}
	});
});

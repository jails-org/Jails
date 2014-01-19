
require.config({

	baseUrl:'../source',
	paths :{ 
		app :'../site/assets/js/jails',
		jquery :['//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min']
	}
});

require(['jquery'], function(){

	require([
		
		'jails-app',
		'app/routes',
		'app/modules/menu',
		'app/modules/content'

	], function(jails, routes, menu, content){

		jails.url.observe();

		if(!location.hash)
			jails.url.redirect('/sobre');
	});
});



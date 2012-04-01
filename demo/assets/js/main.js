Jails.namespace.add('jails', 'assets/js/jails/')	

Jails.namespace.using(
	
	'{jails}models/home.js',
	'{jails}views/home.js',
	'{jails}controllers/home.js',
	'{jails}routes.js'
)
(function(){ 
	
	Jails.url.observe(); 

	if(!location.hash)
		Jails.url.redirect('/');

});


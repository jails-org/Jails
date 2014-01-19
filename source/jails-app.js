define([

	'jails',
	'modules/hashchange',
	'modules/url',
	'modules/mvc'

],function(jails, hash, url, mvc){
	
	jails.url = url.create( jails );
	jails.mvc = mvc.create( jails ); 
	jails.hash = hash.create();

	return jails;
});

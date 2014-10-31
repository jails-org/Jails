require.config({
	baseUrl	:'../scaffold/',
	paths	:{ 'jails' :'../source/jails.min' }
});

define([

	'jails',
	'lib/mustache',

	'apps/my-app'

], function( jails, mustache ){

	jails.start({
		templates :{ engine :mustache }
	});

});

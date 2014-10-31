require.config({ baseUrl: '../scaffold/' });

define([

	'lib/jails',
	'lib/mustache',

	'apps/my-app'

], function( jails, mustache ){

	jails.start({
		templates :{ engine :mustache }
	});

});

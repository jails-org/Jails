require.config({

	baseUrl	:'../scaffold/',

	paths	:{
		'jails' :'../source/jails.min',
		'mods'	:'//rawgit.com/jails-scaffold/Modules/master',
		'comps'	:'//rawgit.com/jails-scaffold/Components/master'
	}
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

require.config({

	baseUrl :'assets/js/',
	deps    :['zepto', 'mustache', 'jails', global.page],

	paths   :{

		jails		:'lib/jails',
		zepto 		:'lib/zepto',
		mustache  	:'lib/mustache',
		mods		:'//rawgit.com/jails-org/Modules/master',
		comps		:'//rawgit.com/jails-org/Components/master'
	},

	callback :function( zepto, mustache, jails ){

		jails.start({
			base        :Zepto,
			templates   :{ engine :mustache }
		});
	}
});

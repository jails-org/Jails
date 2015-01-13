module.exports = function(grunt) {

	grunt.registerTask('j:create', function(module){

		var src, dest, config, name;

		config 	= grunt.config.get('j.create');
		name 	= grunt.option('name');

		src  = config[0].replace(/\{module\}/g, module);
		src  = src.replace(/\{name\}/g, name);
		dest = config[1].replace(/\{name\}/g, name);
		dest = dest.replace(/\{module\}/g, module);

		create( src, dest );
	});

	function create(src, dest){

		var file, tpl, name;

		name = grunt.option('name');
		tpl = grunt.file.read( src );
		file = grunt.template.process( tpl, { data:{ name :name } } );

		grunt.file.write( dest, file );
	}

}

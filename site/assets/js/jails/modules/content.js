define(['jails-app'], function(jails){

	var 
		content, module, loading, status;

	jails.extend('view', module = {

		name :'content',

		initialize :function(){

			content = $('#content');
			loading = 'loading';

			jails.on('update-page', this.update);
		},

		update :function(e, page){
			load('pages/' + page + '.htm');
		},

		display :function(html){
			content.html( html );
		},

		loading :function(){
			content.addClass( loading );
		},

		complete :function(){
			
			content.removeClass( loading );
			this.notify('content-loaded', this);
		},

		error :function(e){

			var action = (status[''+ e.status] || status.redirect);
				action(e);	
		}
	});

	status = {
		
		'404' :function(e){ 
			module.display( e.responseText );
		},

		redirect :function(){
			jails.url.redirect('/sobre');
		}
	};

	function load(url){

		var cache = jails.get_cache('page');

		if(!cache){
			module.loading();
			$.ajax({ url :url, dataType :'html', success :complete, error :error });
		}

		else module.display( cache ); 
	};

	function complete(html){

		module.display( html );

		jails.set_cache('page', html);
		module.complete();
	};

	function error(e){

		module.complete();
		module.error( e );
	}

	return module;
});

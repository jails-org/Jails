/**
 * @class Controller
 */
;(function(Model, View, Data){

	Jails.extend('Controller', Home.Controller = {
		
		index :function(page){
			load('pages/' + page + '.htm');
			View.menu(page);
		}

	});

	function load(url){
        
        var cache = Jails.get_cache('page');		

        if(!cache){	
			View.loading();	
			$.ajax({ url:url, dataType:'html', success:complete });	
		}

		else 
			View.display(cache); 
		
	};

	function complete(html){
        View.display(html);
        Jails.set_cache('page', html);
	};

})(Home.Model, Home.View, Home.Model.data)

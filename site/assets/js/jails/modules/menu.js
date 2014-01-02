define([
	
	'jails-app'

], function(jails){
	
	var 
		menu, menus, module, current, selected;
		
	jails.extend('view', module = {
        
        initialize :function(){
            
            menu = $('#menu');
			menus = $('.menu');

			selected = 'selected';
			
			menu.find('a').click( change );
			menus.find('a').click( redirect );
			
			this.on('update_page', this.update);
        },

		update :function(e, page){
			
			if( current )  
				current.removeClass( selected );

			current = menu.find('.mn-'+page); 
			current.addClass( selected );
		}
	});

	function change(e){
		
		current.removeClass( selected );
		current = $(this);
		current.addClass( selected );

		e.preventDefault();
	}

	function redirect(e){
		
		var url = $(this).attr('href');
		jails.url.redirect( url );

		e.preventDefault();
	}

	return module;
});

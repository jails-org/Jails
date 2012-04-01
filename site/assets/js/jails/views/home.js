;(function(Model){
	
	var
        wrap, content, container, menu;
		
	Jails.extend('View', Home.View = {
        
        initialize :function(){
            
            wrap = $('#wrap');
            content = $('#content');
            container = $('#container');
            menu = $('.menu');

        },

		loading :function(){	
			content.children().hide();
			wrap.addClass('loading');	
		},

		complete :function(){
			wrap.removeClass('loading');
		},

		display :function(html){
            this.complete();
			content.html( html );
		},

		menu :function(action){
			menu.find('.selected').removeClass('selected');
            menu.find('a').each(function(){
                if(this.href.match(location.hash))
                    $(this).addClass('selected');
            });
		}

	});

})(Home.Model)

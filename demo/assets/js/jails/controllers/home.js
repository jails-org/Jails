/**
 * @class Controller
 */
;(function(Model, View){

	Jails.extend('Controller', Home.Controller = {
        
        before_filter :{ filter :my_filter, action: ['index'] },

		index :function(){
			View.hello_world();
		}
	});	
		
    function my_filter(){
        alert('Before filter called!!');
    };

})(Home.Model, Home.View)

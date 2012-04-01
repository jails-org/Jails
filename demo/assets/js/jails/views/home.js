;(function(Model){

	var body;

	Jails.extend('View', Home.View = {
		
		initialize :function(){
			body = $('body');
		},

        hello_world :function(){
            alert('Hello World!, new Jails Mvc Project =)');
        }

	});

})(Home.Model)

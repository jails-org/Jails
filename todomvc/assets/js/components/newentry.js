define(['jails'], function( jails ){

	jails.component('newentry', function(html){

		var
			cp 		= this,
			input 	= html.find('input'),
			all		= $('#toggle-all');

		this.init = function(){

			input.on('keypress', enter).focus();
			all.on('change', toggle_all);
		};

		function enter(e){

			var v = $.trim( this.value );

			if(e.keyCode == 13 && v)
				cp.emit('create', v);
		}

		function toggle_all(){
			cp.emit('mark-all', this.checked);
		}

	});

});

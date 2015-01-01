define(['jails'], function( jails ){

	jails.component('todo', function(li){

		var
			cp = this,
			input_text	=  li.find('.edit'),
			checkbox	=  li.find('.toggle'),
			label		=  li.find('label'),
			x			=  li.find('.destroy'),
			id			= +li.data('id'),
			old_value	= '';

		this.id = id;

		this.init = function(){

			x.on('click', destroy);
			label.on('dblclick', edit);
			checkbox.on('change', toggle);
			input_text.on('keypress', enter).on('blur', finish);
		};

		function edit(e){

			li.addClass('editing');
			input_text.focus();
			old_value = input_text.val();
		}

		function finish(){

			li.removeClass('editing');

			if(!this.value) this.value = old_value;
			else cp.emit('edited', cp);
		}

		function destroy(){
			cp.emit('destroy', cp);
		}

		function toggle(){
			cp.emit('complete', cp);
		}

		function enter(e){
			if(e.keyCode == 13) this.blur();
		}

		this.value = function(){

			var completed = checkbox.prop('checked');

			return {
				id			:id,
				value		:input_text.val(),
				completed	:completed,
				state		:completed?	'completed'	:'',
				checked		:completed?	'checked'	:''
			};
		};
	});
});

define([

	'jails',
	'mods/persistence/persistence'

], function( jails, persistence ){

	return jails.model('todos', function(){

		var filter, by = 'all', model = this;

		persistence( model ).on();

		this.schema = {
			id			:Number,
			completed 	:Boolean,
			checked		:Boolean,
			value		:String,
			state		:String
		};

		this.clear = function(){
			model.data( filter.active(), 'id' );
		};

		this.up = function(cp_todo){
			this.update( cp_todo.id, cp_todo.value() );
		};

		this.create = function(text){

			var id = next(1);

			this.update( id, {
				id			:id,
				completed 	:false,
				value 		:text,
				state 		:'',
				checked		:false
			});
		};

		this.mark_all = function(mark){

			$.each(this.data(), function(i, todo){

				todo.completed 	= mark;
				todo.state	   	= mark? 'completed':'';
				todo.checked	= mark? 'checked' :'';

				model.update( todo.id, todo );
			});
		};

		this.result = function(newby){

			var
			array	= filter.all(),
			done	= filter.completed();

			by = newby || by;

			return{
				todos 			:filter[by]? filter[by]() :filter.all(),
				count			:filter.active().length,
				has_todos 		:array.length,
				all_completed	:done.length,
				toggle_all		:done.length == array.length? 'checked' :''
			};
		};

		function next(seed){

			var max = 0;

			$.each(filter.all(), function(){
				max = max > +this.id? max :+this.id;
			});

			return (max + seed);
		}

		filter = {

			active :function(){
				return $.grep( filter.all(),
					function(todo){ return !todo.completed; });
			},

			completed :function(){
				return $.grep( filter.all(),
					function(todo){ return todo.completed; });
			},

			all	:function(){
				return $.map( model.data(), function(item){ return [item]; });
			}
		};
	});
});

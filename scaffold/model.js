define([

	'jails'

], function( jails ){

	return jails.model('<%=name%>', function(html){

		var model = this;

		this.schema = {
			name	:String,
			age	:Number
		};
	});
});

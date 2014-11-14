define(['jails'],function(jails){

	return jails.model('my-model', {

		data :{},

		schema :{
			author	:null,
			title	:null,
			description :null,
			post	:null
		}
	});
});

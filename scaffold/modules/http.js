define(function(){

	var http = {
		post	:request('post'),
		get	 :request('get'),
		jsonp	:request('getJSON')
	};

	function request(method){

		return function(url, data, type){
			return $[method](url, data, null, type || 'json');
		}
	}

	return http;

});

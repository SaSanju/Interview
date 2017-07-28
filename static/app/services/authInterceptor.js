angular.module('myapp')
	.factory('AuthInterceptor', ['UserAuth', '$q', function(UserAuth, $q){
		var authInterceptor = {};
		authInterceptor.request = function(config){
			var token = UserAuth.getToken();
			if(token){
				config.headers['x-access-token'] = token;
			}
			return config;
		};
		authInterceptor.responseError = function(response){
			if(response.status === 403){
				return $q.reject(response);
			}
		};
		return authInterceptor;
	}]);

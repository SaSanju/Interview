angular.module('myapp', ['app.routes'])
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('AuthInterceptor');
	});

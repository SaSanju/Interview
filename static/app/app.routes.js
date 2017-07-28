angular.module("app.routes", ['ngRoute'])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/static/app/views/partials/home.html',
            controller: 'mainCtrl',
        });
        $routeProvider.when('/login', {
            templateUrl: '/static/app/views/partials/login.html',
            controller: 'mainCtrl',
        });
        $routeProvider.when('/invite', {
            templateUrl: '/static/app/views/partials/invite-candidates.html',
            controller: 'inviteCtrl',
        });
        $routeProvider.when('/signup', {
            templateUrl: '/static/app/views/partials/signup.html',
            controller: 'mainCtrl',
        });
        $routeProvider.when('/invitation/:invitationToken', {
            templateUrl: '/static/app/views/partials/candidate-interview.html',
            controller: 'interviewCtrl',
        });
        // $routeParam
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
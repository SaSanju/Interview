angular.module("app.routes", ['ngRoute'])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/app/views/partials/home.html',
            controller: 'mainCtrl',
        });
        $routeProvider.when('/login', {
            templateUrl: '/app/views/partials/login.html',
            controller: 'mainCtrl',
        });
        $routeProvider.when('/invite', {
            templateUrl: '/app/views/partials/invite-candidates.html',
            controller: 'inviteCtrl',
        });
        $routeProvider.when('/signup', {
            templateUrl: '/app/views/partials/signup.html',
            controller: 'mainCtrl',
        });
        $routeProvider.when('/invitation/:invitationToken', {
            templateUrl: '/app/views/partials/candidate-interview.html',
            controller: 'interviewCtrl',
        });
        // $routeParam
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
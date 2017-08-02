/*jshint esversion: 6 */
angular.module('myapp')
    .factory('AuthService', ['$http', '$q', 'UserAuth', function($http, $q, UserAuth){
    var auth = {user: null};
    
    auth.login = function(email, password){
        var postData = {
            email: email,
            password: password
        };
        var deferred = $q.defer();
        $http.post('/api/login', postData).then((response) =>{
            if(response.data && response.data.token);
            UserAuth.setData(response.data);
            deferred.resolve(response.data);
        }, (error) => {
            var errorMsg = "Something wrong";
            console.log('error', error);
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    auth.signup = function(email, password){
        var postData = {
            email: email,
            username: email,
            password: password
        };
        var deferred = $q.defer();
        $http.post('/api/signup', postData).then((response) =>{
            if(response.data && response.data.token)
            {UserAuth.setData(response.data);
            deferred.resolve(response.data);}
        }, (error) => {
            var errorMsg = "Something wrong";
            console.log('error', error);
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    auth.logout = function(){
        UserAuth.setData();
    };

    auth.isLoggedIn = function(){
        if(UserAuth.getToken()){
            return true;
        }
        return false;
    };

    auth.getUser = function(){
        if(this.isLoggedIn()) {
            return UserAuth.getUserData();
        }

    };

    auth.invite = function(inviteEmail) {
        var deferred = $q.defer();
        $http.post('/api/invite', {inviteEmail}).then((response) =>{
            deferred.resolve(response.data);
        }, (error) => {
            var errorMsg = "Something wrong";
            console.log('error', error);
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    auth.getInvites = function() {
        var deferred = $q.defer();
        $http.get('/api/invite').then((response) =>{
            deferred.resolve(response.data);
        }, (error) => {
            var errorMsg = "Something wrong";
            console.log('error', error);
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    auth.verifyInvitation = function(email, invitationToken) {
        var params = {
            invitationToken,
            email
        };
        console.log(params);
        var deferred = $q.defer();
        $http.post('/api/verify-invitation/', params).then((response) =>{
            deferred.resolve(response.data);
        }, (error) => {
            var errorMsg = "Something wrong";
            console.log('error', error);
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    auth.submitAnswer = function(params) {
        var deferred = $q.defer();
        $http.post('/api/submit-answers', params).then((response) =>{
            deferred.resolve(response.data);
        }, (error) => {
            var errorMsg = "Something wrong";
            console.log('error', error);
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };


    return auth;
}]);

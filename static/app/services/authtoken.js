angular.module('myapp')
    .factory('UserAuth', function(){
        var UserAuth = {};
        
        UserAuth.setData = function(data){
            if(data){
                window.localStorage.setItem('userData', JSON.stringify(data));
            }
            else{
                window.localStorage.removeItem('userData');
            }
        };

        UserAuth.getData = function(){
            return JSON.parse(window.localStorage.getItem('userData'));
        };

        UserAuth.getToken = function() {
            var data = this.getData();
            return data ? data.token : null;
        };

        UserAuth.getUserData = function() {
            var data = this.getData();
            return data ? data.user : null;
        };

        return UserAuth;

    });
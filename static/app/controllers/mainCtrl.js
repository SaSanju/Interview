/*jshint esversion: 6 */
angular.module('myapp')
    .controller('mainCtrl', ['AuthService', '$scope', '$rootScope', '$location', 'UserAuth', function(AuthService, $scope, $rootScope, $location, UserAuth) {
        $rootScope.$on('$routeChangeStart', () => {
            $scope.isLoggedIn = AuthService.isLoggedIn();
            if ($scope.isLoggedIn) {
                var user = AuthService.getUser();
                AuthService.user = user;
                $scope.user = user;
                if (user && window.location.pathname === '/login') {
                    $location.url('/invite');
                }
            } else if (window.location.pathname === '/invite') {
                $location.url('/login');
                return;
            }
        });
        $scope.isLoggedIn = AuthService.isLoggedIn();
        $scope.login = function(email, password) {
            $scope.errorMsg = '';
            AuthService.login(email, password).then((response) => {
                console.log(response);
                if (!response.success) {
                    window.alert(response.message);
                    return;
                }
                $location.path('/invite');
            });
        };

        $scope.signUp = function(email, password) {
            $scope.errorMsg = '';
            AuthService.signup(email, password).then((response) => {
                console.log(response);
                if (!response.success) {
                    window.alert(response.message);
                    return;
                }
                $location.path('/invite');
            });
        };

        $scope.logout = function() {
            AuthService.logout();
            $location.path('/');
        };

    }])

    .controller('inviteCtrl', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {
        $scope.invites = [];

        function getInvites() {
            AuthService.getInvites().then((response) => {
                $scope.invites = response.invites;
            }, (err) => {
                window.alert(err);
            });
        }

        getInvites();

        $scope.inviteCandidate = function() {
            var inviteEmail = $scope.inviteEmail;
            AuthService.invite(inviteEmail).then((response) => {
                window.prompt(response.message, response.magicLink);
                getInvites();
            }, (err) => {
                window.alert(err);
            });
        };

    }])

    .controller('interviewCtrl', ['$scope', '$location', '$routeParams', 'AuthService', function($scope, $location, $routeParams, AuthService) {
        var invitationToken = $routeParams.invitationToken;

        $scope.email = '';
        $scope.problems = [];
        $scope.isVerified = false;

        $scope.verifyInvitation = function(email) {
            AuthService.verifyInvitation(email, invitationToken).then((response) => {
                console.log(response);
                if (!response.success) {
                    window.alert(response.message);
                    return;
                }
                $scope.isVerified = true;
                $scope.problems = response.problems;
                $scope.inviteId = response.inviteId;
                $scope.score = response.score;
            }, (err) => {
                window.alert(err);
            });
        };

        $scope.submitAnswers = function() {
            var problemIdChoiceMap = {};
            for (let index = 0; index < $scope.problems.length; index++) {
                let problem = $scope.problems[index];
                if (!problem.choosen) {
                    window.alert('Please select choices for all questions');
                    return;
                }
                problemIdChoiceMap[problem._id] = problem.choosen;
            }

            var params = {
                problemIdChoiceMap: problemIdChoiceMap,
                inviteId: $scope.inviteId,
                invitationToken: invitationToken
            };

            AuthService.submitAnswer(params).then((response) => {
                if (!response.success) {
                    window.alert(response.message);
                    return;
                }
                $scope.score = response.invite.score;
                $scope.problems = [];
            });
        };

    }]);
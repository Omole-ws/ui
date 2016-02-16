angular.module('ccengine')

.controller('loginCtrl', ['$http', '$location', '$httpParamSerializer', '$rootScope', '$scope', 'messagesSvc',
function ($http, $location, $httpParamSerializer, $rootScope, $scope, msgs) {
    // $scope.auth = {};
    $http.get('/auth/check');
    $scope.doAuth = function () {
        console.log($scope.auth.login + ':' + $scope.auth.password);
        // $http.post('/auth/login?login=' + $scope.login + '&password=' + $scope.password)
        // $http.post('/auth/login', {login: $scope.login, password: $scope.password }, {
        $http.post('/auth/login', $httpParamSerializer($scope.auth),
            {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (resp) {
            console.log('Login successfull!');
            $rootScope.username = resp.data;
            $location.url('/app');
        }, function (err) {
            console.log('Login failed!');
            msgs.send('err', 'Login error. Server: ' + err.statusText);
        });
    };
}]);

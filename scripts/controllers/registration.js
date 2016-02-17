angular.module('ccengine')

.controller('registerCtrl', ['$http', '$location', '$scope', 'messagesSvc', function ($http, $location, $scope, msgs) {
    $http.get('/auth/check');
    $scope.doAuth = function () {
        $http.post('/auth/registration', {login: $scope.login, mail: $scope.mail, password: $scope.password})
        .then(function (resp) {
            console.log('Registration successfull!');
            $location.url('/app/login');
        }, function (err) {
            console.log('Registration failed!');
            msgs.send('err', 'Registration error. Server: ' + err.statusText);
        });
        console.log($scope.login + ':' + $scope.password);

    };
}]);

angular.module('ccengine')
.controller('messagesCtrl', ['$scope', 'messagesSvc', function ($scope, msgs) {
    $scope.msgs = msgs;
}]);


angular.module('ccengine')

.controller('deskMenuCtrl', ['$scope', '$state', 'eventsDeliverySvc', function ($scope, $state, evs) {
    $scope.mode = 'visual';
    $scope.showOpts = false;

    $scope.back = function () {
        $state.go('home');
    };

    $scope.setMode = function (mode) {
        evs.notify('DESK_MODE_CHANGE', mode);
        $scope.mode = mode;
    };

    $scope.toggleOpts = function () {
        $scope.showOpts = !$scope.showOpts;
        evs.notify('DESK_SHOW_OPTS_CHANGE', $scope.showOpts);
    };
}]);

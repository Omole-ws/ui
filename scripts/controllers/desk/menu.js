angular.module('ccengine')

.controller('deskMenuCtrl', ['$scope', '$http', '$state', 'eventsDeliverySvc', 'dataSvc',
function ($scope, $http, $state, evs, data) {
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

    $scope.changeLayout = function (layout) {
        evs.notify('VIZ_APPLY_LAYOUT', layout);
    };

    $scope.invalidateCaches = function () {
        $http.get('/app/t/ccgraphevict?gid=' + data.gid, {headers: {Accept: 'text/plain'}});
    };

    $scope.algos = data.algos;
    $scope.run = function (algo) {
        evs.notify('DESK_RUN_ALGO', algo);
    };
}]);

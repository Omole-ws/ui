angular.module('ccengine')
.controller('deskCtrl', ['$interval', '$http', '$stateParams', '$scope', 'messagesSvc', 'dataSvc', 'contextSvc', '$state', 'eventsDeliverySvc',
function ($interval, $http, $routeParams, $scope, msgs, data, ctx, $state, evs) {
    $scope.back = function () {
        $state.go('home');
    };

    evs.subscribe('DESK_MODE_CHANGE', function (mode) {
        $scope.mode = mode;
    });
    evs.subscribe('DESK_SHOW_OPTS_CHANGE', function (showOpts) {
        $scope.showOpts = showOpts;
    });
    $scope.mode = 'visual';
    data.setupDesk($routeParams.gid);
    $scope.ctx = ctx;
    $scope.algos = data.algos;

    $scope.curAlgo = null;
    $scope.run = taskRunner;
    function taskRunner(algo) {
        if (algo.running || $scope.levelOps === true || $scope.pathOps === true) {
            return;
        }
        algo.running = true;
        var params = {};
        switch (algo.imputParam) {
            case 'INPUT_GID':
                params.gid = data.gid;
                break;
            case 'INPUT_GID_LABEL':
                if ($scope.levelOps === 'ready') {
                    $scope.levelOps = false;
                    params.gid = data.gid;
                    params.cclabel = $scope.kind;
                    algo.running = true;
                } else {
                    algo.running = false;
                    $scope.curAlgo = algo;
                    $scope.levelOps = true;
                    return;
                }
                break;
            case 'INPUT_GID_FROM_TO_LABEL':
                if ($scope.pathOps === 'ready') {
                    $scope.pathOps = false;
                    params.from = ctx.sel.n[0].id;
                    params.to = ctx.sel.n[1].id;
                    params.gid = data.gid;
                    params.cclabel = $scope.kind;
                    algo.running = true;
                } else {
                    algo.running = false;
                    $scope.curAlgo = algo;
                    $scope.pathOps = true;
                    ctx.selRun({directed: true, n: 2});
                    return;
                }
                break;
        }
        $http.get(data.algos.domain + algo.url, {params: params, headers: {Accept: 'text/plain'}})
        .then(function (resp) {
            var checker = $interval(function () {
                if (algo.checkInProgress) {
                    return;
                }
                algo.checkInProgress = true;
                $http.get(data.algos.checkURL, {params: {cckey: resp.data}}).then(function (resp) {
                    if (resp.data[0].startsWith('Completed 100% ')) {
                        switch (algo.outputParam) {
                            case 'OUTPUT_VERTEXMAP':
                                data.groups.add(resp.data[1]);
                                break;
                            case 'OUTPUT_PATHES':
                                if (resp.data.length && resp.data.length > 1) {
                                    data.paths.add(resp.data.slice(1));
                                }
                                break;
                        }
                        algo.running = false;
                        $interval.cancel(checker);
                    }
                }, function (err) {
                    msgs.send('err', 'Error in checking status. Server: ' + err.statusText);
                })
                .finally(function () {
                    algo.checkInProgress = false;
                });
            }, 500, 0);
        }, function () {
            algo.running = false;
        });
    }
}])
.controller('graphOptsCtrl', ['$scope', 'dataSvc', 'contextSvc',
function ($scope, data, ctx) {
    // $('.panel-title > a').on('click', function (ev) {
    angular.element('#opts').on('click', 'a[role="button"]', function (ev) {
        ev.preventDefault();
    });
    $scope.pop = function (id) {
        $(id).popover('toggle');
        // $(id).popover();
    };
    $scope.ctx = ctx;
    $scope.data = data;
    $scope.groups = data.groups;
    $scope.paths = data.paths;
    $scope.getNodeName0 = function (id) {
        for (var i = 0, sz = data.nodes.length; i < sz; i++) {
            if (data.nodes[i].id === id) {
                return data.nodes[i].info.label;
            }
        }
    };
    $scope.getNodeName = function (id) {
        return _.find(data.nodes, {id: id}).info.label;
    };

}]);


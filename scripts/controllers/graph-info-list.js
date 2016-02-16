angular.module('ccengine')
.controller('graphInfoListCtrl', ['$scope', 'messagesSvc', 'graphSvc',
function ($scope, msgs, graphSvc) {
    // get list of GraphInfo structures
    // $scope.clearErrors = ctx.clearErrors.bind(ctx);
    // $scope.clearErrors = function () {
    //     ctx.clearErrors();
    // };
    var mID = msgs.send('inf', 'Loading data...');
    $scope.graphinfos = graphSvc.query();
    $scope.graphinfos.$promise.catch(function (err) {
        msgs.send('err', 'Failed to retrieve data. Server: ' + err.statusText);
    }).finally(function () {
        msgs.clear(mID);
    });

    $scope.newGraphSave = function (data) {
        var mID = msgs.send('inf', 'Creating new graph...');
        data.nodes = [];
        data.edges = [];
        var gr = graphSvc.insert(data).$promise.then(function (ok) {
            $scope.graphinfos = graphSvc.query();
        }, function (err) {
            msgs.send('err', 'Failed to create new graph. Server: ' + err.statusText);
        }).finally(function () {
            msgs.clear(mID);
        });
    };
    $scope.editGraphSave = function (gi, change) {
        var mID = msgs.send('inf', 'Updating...');
        var old = angular.copy(gi);
        angular.merge(gi, change);
        // graphSvc.update({id: gi.id}, gi).$promise.catch(function (err) {
        gi.$update().catch(function (err) {
            msgs.send('err', 'Failed to update. Server: ' + err.statusText);
            angular.merge(gi, old);
        }).finally(function () {
            msgs.clear(mID);
        });
    };

    $scope.removeGraph = function (gi) {
        var mID = msgs.send('inf', 'Removing...');
        gi.$delete().then(function (ok) {
            $scope.graphinfos.splice($scope.graphinfos.indexOf(gi), 1);
        }, function (err) {
            msgs.send('err', 'Failed to remove. Server: ' + err.statusText);
        }).finally(function () {
            msgs.clear(mID);
        });
    };

    $scope.back = function () {
        window.history.back();
    };
}]);

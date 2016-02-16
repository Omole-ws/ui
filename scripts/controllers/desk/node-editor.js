angular.module('ccengine')
.controller('graphOperationsNECtrl', ['$scope', 'dataSvc',
function ($scope, data) {
    $scope.vs = data.nodes;

    $scope.newNodeSave = function (node) {
        data.insert({n: [node]});
    };
    $scope.editNodeSave = function (node, changes) {
        var old = angular.copy(node);
        angular.merge(node, changes);
        try {
            data.update({n: [node]});
        } catch (err) {
            angular.merge(node, old);
        }

        // var mID = ctx.errors.send('inf', 'Updating...');
        // editNodeValue.$update({gid: $routeParams.gid}, function (resp) {
        //     ctx.errors.clear(mID);
        //     editNodeValue = undefined;
        // }, function (err) {
        //     ctx.errors.clear(mID);
        //     editNodeValue = angular.copy(editNodeValueOld, editNodeValue);
        //     ctx.errors.send('err', 'Failed to update asset. Server: ' + err.statusText);
        // });
    };
    $scope.removeNode = function (node) {
        data.remove({n: [node]});
        // var mID = ctx.errors.send('inf', 'Removing...');
        // node.$delete({gid: $routeParams.gid}, function () {
        //     ctx.errors.clear(mID);
        //     ctx.data.remove({n: [node]});
        // }, function (err) {
        //     ctx.errors.clear(mID);
        //     ctx.errors.send('err', 'Failed to remove asset. Server: ' + err.statusText);
        // });
    };
}]);

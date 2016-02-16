angular.module('ccengine')
.controller('graphOperationsLECtrl', ['$scope', 'eventsDeliverySvc', 'dataSvc', 'contextSvc',
function ($scope, evs, data, ctx) {
    $scope.es = data.edges;
    $scope.ctx = ctx;

    $scope.getNodeName = function (id) {
        for (var i = 0, sz = data.nodes.length; i < sz; i++) {
            if (data.nodes[i].id === id) {
                return data.nodes[i].info.label;
            }
        }
    };

    $scope.newEdgeSave = function () {
        data.insert({e: [{info: {}, cclabel: $scope.cclabel, source: ctx.sel.n[0].id, target: ctx.sel.n[1].id}]});
        // ctx.sel.stop();
        // var sel = ctx.sel.get();
        // var mID = ctx.errors.send('inf', 'Saving...');
        // eSvc.save({gid: $routeParams.gid}, $scope.newEdge, function (resp) {
        //     ctx.errors.clear(mID);
        //     ctx.data.insert({e: [resp]});
        // }, function () {
        //     ctx.errors.clear(mID);
        //     ctx.errors.send('err', 'Failed to create new relation. Server: ' + err.statusText);
        // });
        // newEdgeMode = undefined;
        // $scope.newEdge = {info: {}, cclabel: 'READ'};
    };

    $scope.removeEdge = function (edge) {
        data.remove({e: [edge]});
        // var mID = ctx.errors.send('inf', 'Removing...');
        // edge.$delete({gid: $routeParams.gid}, function () {
        //     ctx.errors.clear(mID);
        //     ctx.data.remove({e: [edge]});
        // }, function () {
        //     ctx.errors.clear(mID);
        //     ctx.errors.send('err', 'Failed to remove relation. Server: ' + err.statusText);
        // });
    };

    // behevior

    // function getNode(id) {
    //     if (Array.isArray(ctx.data.nodes)) {
    //         return ctx.data.nodes.find(function (el) {
    //             return el.id === id;
    //         });
    //     } else {
    //         return null;
    //     }
    // }
    // function getNodeName(id) {
    //     var n = getNode(id);
    //     if (n) {
    //         return n.info.label;
    //     } else {
    //         return null;
    //     }
    // }

}]);

angular.module('omole.resources', [])

.factory('graphSvc', ['$resource', function ($resource) {
    return $resource('/app/r/graphs/:id', {id: '@id'}, {
        update: {method: 'PATCH'},
        save: {method: 'PUT'},
        insert: {method: 'POST'}
    });
}])

.service('gvattrsSvc', ['$resource', function ($resource) {
    return $resource('/app/r/vizattrs/:id', {id: '@id'}, {
        insert: {method: 'POST'},
        save: {method: 'PUT'}
    });
}])

.factory('pathGroupsSvc', ['$resource', function ($resource) {
    return $resource('/app/r/paths/:id', {id: '@id'});
}])

.factory('nodeGroupsSvc', ['$resource', function ($resource) {
    return $resource('/app/r/nodegroups/:id', {id: '@id'});
}]);

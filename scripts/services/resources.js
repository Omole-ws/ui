angular.module('omole.resources', [])

.factory('graphSvc', ['$resource', 'configSvc', function ($resource, cfg) {
    return $resource(cfg.dataServicesBaseURL + '/graphs/:id', {id: '@id'}, {
        update: {method: 'PATCH'},
        save: {method: 'PUT'},
        insert: {method: 'POST'}
    });
}])

.factory('pathGroupsSvc', ['$resource', 'configSvc', function ($resource, cfg) {
    return $resource(cfg.dataServicesBaseURL + '/paths/:id', {id: '@id'});
}])

.factory('nodeGroupsSvc', ['$resource', 'configSvc', function ($resource, cfg) {
    return $resource(cfg.dataServicesBaseURL + '/nodegroups/:id', {id: '@id'});
}]);

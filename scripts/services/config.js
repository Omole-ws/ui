angular.module('omole.config', [])

.factory('configSvc', ['$location', function ($location) {
    var proto = $location.protocol();
    var host = $location.host();
    var cfg = {};
    Object.defineProperties(cfg, {
        host: {value: proto + '://' + host},
        dataServicesBaseURL: {value: proto + '://' + host + ':57057'},
        algoServicesBaseURL: {value: proto + '://' + host + ':8081'}
    });
    return cfg;
}]);

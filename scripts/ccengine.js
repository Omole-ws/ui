// angular.module('ccengine', ['ui.router', 'ngRoute', 'ngResource', 'ccengine.resources'])
angular.module('ccengine', ['ngResource', 'ui.router', 'omole.config', 'omole.resources'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
 function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('home', {
        url: '/app',
        resolve:{
            list: function (messagesSvc, graphSvc) {
                var mID = messagesSvc.send('inf', 'Loading data...');
                var list = graphSvc.query();
                list.$promise.then(function () {
                    messagesSvc.clear(mID);
                }, function (err) {
                    messagesSvc.send('err', 'Failed to retrieve data. Server: ' + err.statusText);
                }).finally(function () {
                    messagesSvc.clear(mID);
                });
                return list;
            },
            user: function ($http, $location, messagesSvc) {
                return $http.get('/auth/check').then(function (resp) {
                    return resp.data;
                }, function (err) {
                    // messagesSvc.send('err', 'Auth failed. Server: ' + err.statusText);
                    $location.url('/app/login');
                    return null;
                });
            }
        },
        views: {
            menu:{
                templateUrl: 'views/list/menu.html',
                controller: 'listCtrl'
            },
            main:{
                templateUrl: 'views/list/list.html',
                controller: 'listCtrl',
            }
        }
    })
    .state('login', {
        url: '/app/login',
        views: {
            main: {
                templateUrl: 'views/login.html',
                controller: 'loginCtrl'
            }
        }
    })
    .state('registration', {
        url: '/app/registration',
        views: {
            main: {
                templateUrl: 'views/registration.html',
                controller: 'registerCtrl'
            }
        }
    });

    // $urlRouterProvider.when(state.url, ['$match', '$stateParams', function ($match, $stateParams) {
    //     if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
    //         $state.transitionTo(state, $match, false);
    //     }
    // }]);

    $locationProvider.html5Mode (true);
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // $httpProvider.defaults.useXDomain = true;
}])

.run(function ($rootScope, $urlRouter) {
    $rootScope.$on('$locationChangeSuccess', function (ev) {
        // ev.preventDefault();
        console.log('Interceptor!!!');
        // $urlRouter.sync();
    });
    $rootScope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {
        // ev.preventDefault();
        console.log('Interceptor2!!! from: ' + fromState.name + ' to: ' + toState.name);
        // $urlRouter.sync();
    });
})

.filter('prettyfyJSON', function () {
    return function (obj) {
        return JSON.stringify(obj, null, ' ');
    };
})

.controller('rootCtrl', ['$location', '$http', '$scope', function ($location, $http, $scope) {
    // $http.get('/auth/check')
    // .then(function (resp) {
    // });
}]);


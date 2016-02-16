// angular.module('ccengine', ['ui.router', 'ngRoute', 'ngResource', 'ccengine.resources'])
angular.module('ccengine', ['ngResource', 'ui.router', 'omole.resources'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
 function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('home', {
        url: '/app',
        resolve:{
            list: function ($rootScope, messagesSvc, graphSvc) {
                var mID = messagesSvc.send('inf', 'Loading data...');
                // $rootScope.username = 'aa';
                var list = $rootScope.username_promise.then(function (uname) {
                    var l = graphSvc.query({username: $rootScope.username});
                    l.$promise.then(function () {
                        // messagesSvc.clear(mID);
                    }, function (err) {
                        messagesSvc.send('err', 'Failed to retrieve data. Server: ' + err.statusText);
                    }).finally(function () {
                        messagesSvc.clear(mID);
                    });
                    return l;
                }, function () {
                    return [];
                });
                // var list = graphSvc.query({username: $rootScope.username});
                return list;
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
    .state('graph', {
        url: '/app/desk/{gid}',
        views: {
            menu: {
                templateUrl: '/views/desk/menu.html',
                controller: 'deskMenuCtrl',
            },
            main: {
                templateUrl: '/views/desk/desk.html',
                controller: 'deskCtrl'
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
    delete $httpProvider.defaults.headers.common['X-XSRF-TOKEN'];
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // $httpProvider.defaults.useXDomain = true;
}])

.run(function ($rootScope, $urlRouter, $state, $http) {
    $rootScope.$on('$locationChangeSuccess', function (ev, to) {
        // ev.preventDefault();
        console.log('Interceptor!!!');
        // if (to !== '/app/login' && to !== '/app/registration') {
        //     if (!$rootScope.user) {
        //         ev.preventDefault();
        //         $state.go('login');
        //     } else {
        //         $http.get('/auth/check').then(function (resp) {
        //             $rootScope.user = resp.data;
        //         }, function (err) {
        //             // messagesSvc.send('err', 'Auth failed. Server: ' + err.statusText);
        //             $state.go('login');
        //         });
        //     }
        // }
        // $urlRouter.sync();
    });
    $rootScope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {
        // ev.preventDefault();
        console.log('Interceptor2!!! from: ' + fromState.name + ' to: ' + toState.name);
        if (toState.name !== 'login' && toState.name !== 'registration') {
            $rootScope.username_promise = $http.get('/auth/check').then(function (resp) {
                $rootScope.username = resp.data;
            }, function (err) {
                // messagesSvc.send('err', 'Auth failed. Server: ' + err.statusText);
                $state.go('login');
            });
        }
        // $urlRouter.sync();
    });
})

.filter('prettyfyJSON', function () {
    return function (obj) {
        return JSON.stringify(obj, null, ' ');
    };
})

.controller('rootCtrl', ['$location', '$http', '$rootScope', '$scope', 'messagesSvc',
    function ($location, $http, $rootScope, $scope, msgs) {
    // $scope.username;
    $scope.outOfHere = function () {
        // window.location = '/';
        window.location.replace('/');
    }
    $scope.logout = function () {
        var mID = msgs.send('inf', 'Logging out...');
        $http.post('/auth/logout')
        .then(function () {
            $rootScope.username = undefined;
            $location.url('/app/login');
        }, function (err) {
            msgs.send('err', 'Logout failed. Server: ' + err.statusText);
        }).finally(function () {
            msgs.clear(mID);
        });
    };
    // $http.get('/auth/check')
    // .then(function (resp) {
    // });
}]);


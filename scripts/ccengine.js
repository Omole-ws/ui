// angular.module('ccengine', ['ngResource', 'ngCookies', 'ui.router', 'omole.resources'])
angular.module('ccengine', ['ngResource', 'ui.router', 'omole.resources'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
 function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('home', {
        url: '/app',
        resolve:{
            list: function ($rootScope, messagesSvc, graphSvc) {
                // $rootScope.username = 'aa';
                var list = $rootScope.username_promise.then(function (uname) {
                    var mID = messagesSvc.send('inf', 'Loading data...');
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
    $httpProvider.interceptors.push(function ($q) {
        return {
            response: function (resp) {
                var hdrs = resp.headers();
                if (hdrs['x-xsrf-token']) {
                    $httpProvider.defaults.headers.common['x-xsrf-token'] = hdrs['x-xsrf-token'];
                }
                return resp;
            },
            responseError: function (resp) {
                var hdrs = resp.headers();
                if (hdrs['x-xsrf-token']) {
                    $httpProvider.defaults.headers.common['x-xsrf-token'] = hdrs['x-xsrf-token'];
                }
                return $q.reject(resp);
            }
        };
    });
    $httpProvider.defaults.useXDomain = true;
}])

// .run(function ($rootScope, $urlRouter, $http, $cookies, $q, $state) {
.run(function ($rootScope, $urlRouter, $http, $q, $state) {
    $rootScope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {
        // ev.preventDefault();
        console.log('Interceptor2!!! from: ' + fromState.name + ' to: ' + toState.name);
        if ((toState.name === 'login' || toState.name === 'registration') && _.isString($rootScope.username)) {
            $state.go('home');
            return;
        }
        if (toState.name === 'registration') {
            return;
        }
        $rootScope.username_promise = $http.get('/auth/check').then(function (resp) {
            $rootScope.username = resp.data.username;
            return $q.resolve($rootScope.username);
        }, function (err) {
            // messagesSvc.send('err', 'Auth failed. Server: ' + err.statusText);
            $rootScope.username = undefined;
            // $cookies.remove('SESSION');
            // delete $http.defaults.headers.common['x-xsrf-token'];
            $state.go('login');
            return $q.reject(undefined);
        });
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


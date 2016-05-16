angular.module('user')
    .config(['$stateProvider', 'jwtInterceptorProvider', '$httpProvider', function ($stateProvider, jwtInterceptorProvider, $httpProvider) {

        $stateProvider
            .state('signup', {
                url: '/signup',
                views: {
                    'public': {
                        templateUrl: 'modules/user/views/signup.client.view.html',
                    }
                },
                data: {
                    requiresLogin: false
                }
            }).state('signin', {
            url: '/signin',
            views: {
                'public': {
                    templateUrl: 'modules/user/views/signin.client.view.html',
                }
            },
            data: {
                requiresLogin: false
            }
        }).state('userList', {
            url: '/users',
            views: {
                'private': {
                    templateUrl: 'modules/user/views/user-list.client.view.html',
                }
            },
            templateUrl: 'modules/user/views/user-list.client.view.html',
            data: {
                requiresLogin: true,
                requiresAdmin: true
            }
        }).state('editUser', {
            url: '/users/:id/edit',
            views: {
                'private': {
                    templateUrl: 'modules/user/views/user-edit.client.view.html',
                }
            },
            data: {
                requiresLogin: true,
                requiresAdmin: true
            }
        });


        //get token to local storage and set on the headers
        jwtInterceptorProvider.tokenGetter = ['jwtHelper', '$http', 'store', '$state', function (jwtHelper, $http, store, $state) {
            var idToken = store.get('jwt');
            try {
                if (jwtHelper.isTokenExpired(idToken)) {
                    // This is a promise of a JWT id_token
                    return $http({
                        url: 'http://skynetweb.com.ar/api/users/refresh',
                        // This makes it so that this request doesn't send the JWT
                        skipAuthorization: true,
                        method: 'POST',
                        data: {
                            token: idToken
                        }
                    }).then(function (response) {
                        var id_token = response.data.token;
                        store.set('jwt', id_token);
                        return id_token;
                    }, function (err) {
                        store.remove('jwt');
                        $state.go('signin');
                        return false;
                    });
                } else {
                    return idToken;
                }
            } catch (err) {
                store.remove('jwt');
                return false;
            }
        }];
        $httpProvider.interceptors.push('jwtInterceptor');


    }])
    .run(['$rootScope', '$window', 'store', '$location', 'UserServ', function ($rootScope, $window, store, $location, UserServ) {
        $rootScope.$on('$stateChangeStart', function (e, to) {
            if (to.data && to.data.requiresLogin) {
                if (!store.get('jwt')) {
                    //e.preventDefault();
                    return $location.path('/signin');
                } else if (to.data.requiresAdmin && !UserServ.isAdmin()) {
                    e.preventDefault();
                    return $location.path('/dashboard').replace();
                }
            }

        });
    }]);
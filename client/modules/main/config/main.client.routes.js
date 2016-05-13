angular
    .module('main')
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    'public': {
                        templateUrl: 'modules/main/views/home.client.view.html',
                    }
                },
                data: {
                    requiresLogin: false
                }
            })
            .state('dashboard', {
                url: '/dashboard',
                views: {
                    'private': {
                        templateUrl: 'modules/main/views/dashboard.client.view.html',
                    }
                },
                data: {
                    requiresLogin: true
                }
            });

        // use the HTML5 History API
        //$locationProvider.html5Mode(true);


    }]);
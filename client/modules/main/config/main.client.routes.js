angular
    .module('main')
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider
            .state('dashboard', {
                url: '/',
                templateUrl: 'modules/main/views/dashboard.client.view.html',
                data: {
                    requiresLogin: true
                }
            });

        // use the HTML5 History API
        //$locationProvider.html5Mode(true);


    }]);
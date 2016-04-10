angular.module('client')
  .config(['$stateProvider', function($stateProvider) {

    $stateProvider
      .state('clientPanel', {
        url: '/clients',
        templateUrl: 'modules/client/views/client-panel.client.view.html'
      }).state('editClient', {
        url: '/clients/:id/edit',
        templateUrl: 'modules/client/views/edit-client.client.view.html',
      }).state('clientDetail', {
        url: '/clients/:id',
        templateUrl: 'modules/client/views/client-detail.client.view.html',
        data: {
          requiresLogin: true
        }
      });
  }]);
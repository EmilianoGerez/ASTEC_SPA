angular.module('order')
  .config(['$stateProvider', function($stateProvider) {

    $stateProvider
      .state('orderPanel', {
        url: '/orders',
        templateUrl: 'modules/order/views/order-panel.client.view.html',
        data: {
          requiresLogin: true,
          requiresAdmin: true
        }
      }).state('editorder', {
        url: '/orders/:id/edit',
        templateUrl: 'modules/order/views/edit-order.client.view.html',
        data: {
          requiresLogin: true
        }
      }).state('orderDetail', {
        url: '/orders/:id',
        templateUrl: 'modules/order/views/order-detail.client.view.html',
        data: {
          requiresLogin: true
        }
      });
  }]);
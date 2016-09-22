//Articles service used for communicating with the articles REST endpoints
angular.module('order').factory('Orders', ['$resource', '$http', function($resource, $http) {

  var api = $resource('api/orders/:id', {
    id: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });

  var search = $resource('api/orders/:id/search/:number/:lastName', {
    id: '@_id',
    number: 'number',
    lastName: 'lastName'
  });

  function findOrders(year, startMonth, endMonth) {
    var req = {
      method: 'GET',
      url: 'api/orders/vieworders/' + year + '/month/' + startMonth + '/' + endMonth,
    }
    return $http(req);
  }

  return {
    api: api,
    search: search,
    findOrders: findOrders
  };
}]);
//Articles service used for communicating with the articles REST endpoints
angular.module('order').factory('Orders', ['$resource', function($resource) {

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

	return {
		api: api,
		search: search
	};
}]);
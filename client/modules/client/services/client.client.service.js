//Articles service used for communicating with the articles REST endpoints
angular.module('client').factory('Clients', ['$resource', function($resource) {

	var api = $resource('api/clients/:id', {
		id: '@_id'
	}, {
		update: {
			method: 'PUT'
		}
	});

	var search = $resource('api/clients/:id/search/:number/:lastName', {
		id: '@_id',
		number: 'number',
		lastName: 'lastName'
	});

	return {
		api: api,
		search: search
	};
}]);
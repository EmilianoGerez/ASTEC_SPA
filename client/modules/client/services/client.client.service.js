//Articles service used for communicating with the articles REST endpoints
angular.module('client').factory('Clients', ['$resource', function($resource) {

    var api = $resource('api/clients/:id', {
        id: '@_id'
    });

    return {
        api: api
    };
}
]);
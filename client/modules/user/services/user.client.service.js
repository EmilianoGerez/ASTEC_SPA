//Articles service used for communicating with the articles REST endpoints
angular.module('user').factory('Users', ['$resource', function($resource) {

    var api = $resource('api/users/signup/:id', {
        id: '@_id'
    });

    var logout = $resource('api/users/logout/:id', {
        id: '@_id'
    });

    var search = $resource('api/users/search/:name', {
        name: '@name'
    });

    return {
        api: api,
        logout: logout,
        search: search
    };
}
]);
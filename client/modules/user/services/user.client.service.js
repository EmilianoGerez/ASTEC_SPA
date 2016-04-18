//Articles service used for communicating with the articles REST endpoints
angular.module('user').factory('Users', ['$resource', function($resource) {

    var api = $resource('api/users/:id', {
        id: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });

    var signin = $resource('api/users/signin');

    var logout = $resource('api/users/logout/:id', {
        id: '@_id'
    });

    var search = $resource('api/users/search/:email', {
        email: '@email'
    });

    return {
        api: api,
        signin: signin,
        logout: logout,
        search: search
    };
}
]);
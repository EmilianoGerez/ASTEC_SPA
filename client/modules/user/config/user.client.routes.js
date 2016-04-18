angular.module('user')
  .config(['$stateProvider', 'jwtInterceptorProvider', '$httpProvider', function($stateProvider, jwtInterceptorProvider, $httpProvider) {

    $stateProvider
      .state('signin', {
        url: '/signin',
        templateUrl: 'modules/user/views/signin.client.view.html',
        data: {
          requiresLogin: false
        }
      }).state('userList', {
        url: '/users',
        templateUrl: 'modules/user/views/user-list.client.view.html',
        data: {
          requiresLogin: true
        }
      }).state('editUser', {
        url: '/users/:id/edit',
        templateUrl: 'modules/user/views/user-edit.client.view.html',
        data: {
          requiresLogin: true
        }
      });


    //get token to local storage and set on the headers
    jwtInterceptorProvider.tokenGetter = ['jwtHelper', '$http', 'store', '$state', function(jwtHelper, $http, store, $state) {
      var idToken = store.get('jwt');
      try {
        if (jwtHelper.isTokenExpired(idToken)) {
          // This is a promise of a JWT id_token
          return $http({
            url: 'http://localhost:7000/api/users/refresh',
            // This makes it so that this request doesn't send the JWT
            skipAuthorization: true,
            method: 'POST',
            data: {
              token: idToken
            }
          }).then(function(response) {
            var id_token = response.data.token;
            store.set('jwt', id_token);
            console.log('RefresToke: ' + id_token);
            return id_token;
          }, function(err) {
            console.log(err);
            store.remove('jwt');
            $state.go('signin');
            return false;
          });
        } else {
          return idToken;
        }
      } catch (err) {
        store.remove('jwt');
        return false;
      }
    }];
    $httpProvider.interceptors.push('jwtInterceptor');


  }])
  .run(['$rootScope', '$window', 'store', function($rootScope, $window, store) {
    $rootScope.$on('$stateChangeStart', function(e, to) {
      if (to.data && to.data.requiresLogin) {
        if (!store.get('jwt')) {
          $window.location.href = '/signin#/signin';
        }
      }
    });
  }]);
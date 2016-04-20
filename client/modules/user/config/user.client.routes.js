angular.module('user')
  .config(['$stateProvider', 'jwtInterceptorProvider', '$httpProvider', function($stateProvider, jwtInterceptorProvider, $httpProvider) {

    $stateProvider
      .state('signup', {
        url: '/signup',
        templateUrl: 'modules/user/views/signup.client.view.html',
        data: {
          requiresLogin: false
        }
      }).state('signin', {
        url: '/signin',
        templateUrl: 'modules/user/views/signin.client.view.html',
        data: {
          requiresLogin: false
        }
      }).state('userList', {
        url: '/users',
        templateUrl: 'modules/user/views/user-list.client.view.html',
        data: {
          requiresLogin: true,
          requiresAdmin: true
        }
      }).state('editUser', {
        url: '/users/:id/edit',
        templateUrl: 'modules/user/views/user-edit.client.view.html',
        data: {
          requiresLogin: true,
          requiresAdmin: true
        }
      });


    //get token to local storage and set on the headers
    jwtInterceptorProvider.tokenGetter = ['jwtHelper', '$http', 'store', '$window', function(jwtHelper, $http, store, $window) {
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
            return id_token;
          }, function(err) {
            console.log(err);
            store.remove('jwt');
            $window.location.href = '/user#/signin';
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
  .run(['$rootScope', '$window', 'store', '$location', 'UserServ', function($rootScope, $window, store, $location, UserServ) {
    $rootScope.$on('$stateChangeStart', function(e, to) {

      if ($window.location.hash == '#/signin' && $window.location.pathname == '/panel') {
        $window.location.href = '/user#/signin';
      }

      if ($window.location.hash == '#/signup' && $window.location.pathname == '/panel') {
        $window.location.href = '/user#/signup';
      }

      if (to.data && to.data.requiresLogin) {
        if (!store.get('jwt')) {
          $location.path('signin');
        } else if (to.data.requiresAdmin && !UserServ.isAdmin()) {
          $window.location.href = '/panel';
        } else if ($window.location.pathname == '/user' && $window.location.hash == '#/') {
          $window.location.href = '/panel';
        }

      }

    });
  }]);
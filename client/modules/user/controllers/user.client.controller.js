angular.module('user')
  .controller('UserController', ['$window', 'Users', 'UserServ', '$http', 'store', 'jwtHelper', '$stateParams', '$state', function($window, Users, UserServ, $http, store, jwtHelper, $stateParams, $state) {

    var vm = this;
    vm.user = {};
    vm.errorInfo = {};

    vm.publicSignup = function() {

        vm.user.firstName = vm.user.firstName.toLowerCase();
        vm.user.lastName = vm.user.lastName.toLowerCase();
        vm.user.password = vm.user.password.toLowerCase();

      var newUser = new Users.api(vm.user);

      newUser.$save(function(response) {
        store.set('jwt', response.token);
        $state.go('dashboard');
      }, function(err) {
        vm.errorInfo = err.data;
      });
    };

    vm.signup = function() {

        vm.user.firstName = vm.user.firstName.toLowerCase();
        vm.user.lastName = vm.user.lastName.toLowerCase();
        vm.user.password = vm.user.password.toLowerCase();

      //var userRole = (vm.user.role) ? 'Admin' : 'Tech';
      // set code for user role
      if(vm.user.role) {
        vm.user.code = 'yb9b637i2v';
        vm.user.role = 'Admin';
      }else {
        vm.user.code = 'dw77yee18u';
        vm.user.role = 'Tech';
      }

      var newUser = new Users.api(vm.user);

      newUser.$save(function(response) {
        // add user to the list
        vm.users.push(response.data);
        // reset form
        vm.user = {};
      }, function(err) {
        vm.errorInfo = err.data;
      });
    };

    vm.signin = function() {
      var user = new Users.signin(vm.user);

      user.$save(function(response){
        store.set('jwt', response.token);
        //$window.location.href = '/panel#/';
          $state.go('dashboard');

      }, function(err) {
        vm.errorInfo = err.data;
      });
    };

    vm.getAll = function() {
      Users.api.query(function(response) {
        vm.users = response.filter(function(e) {
          return e._id !== vm.currentUser._id;
        });
      });
    };

    vm.getOne = function() {
      Users.api.get({
        id: $stateParams.id
      }, function(response) {
        vm.user = response;
      });
    };

    vm.getCurrentUser = function() {
      vm.currentUser = UserServ.getCurrentUserData();
    };

    vm.update = function() {
      vm.user.$update(function(response) {
        $state.go('userList');
      }, function(err) {
        vm.errorInfo = err.data;
      });
    };

    vm.remove = function(user) {
      var confirm = $window.confirm('Quieres eliminar el usuario ' + user.firstName + ' ' + user.lastName + ' ?');

      if (confirm) {
        user.$remove();
        vm.users = vm.users.filter(function(e) {
          return e._id !== user._id;
        });
      }
    };

    
  }]);


angular.module('user')
  .directive("compareTo", [function() {
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
          ngModel.$validate();
        });
      }
    };
  }]);

angular.module('user')
  .directive('recordAvailabilityValidator', ['$http', 'Users', function($http, Users) {

    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        //var apiUrl = attrs.recordAvailabilityValidator;

        function setAsLoading(bool) {
          ngModel.$setValidity('recordLoading', !bool);
        }

        function setAsAvailable(bool) {
          ngModel.$setValidity('recordAvailable', bool);
        }

        ngModel.$parsers.push(function(value) {
          if (!value || value.length === 0) return;

          setAsLoading(true);
          setAsAvailable(false);

          // using resource
          var data = Users.search.get({
            email: value
          }, function() {
            if (data.data === null) {
              setAsLoading(false);
              setAsAvailable(true);
            }
          });
          return value;
        });
      }
    };
  }]);
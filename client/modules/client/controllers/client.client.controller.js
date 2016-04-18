function ClientCtrl(Clients, $http, $window, $stateParams) {
  var vm = this;

  var masterModel;

  vm.clientModel = {};
  vm.clientSearch = {};
  vm.errorInfo = {
    msg: null,
    data: null
  };
  vm.successInfo = {
    msg: null,
    data: null
  };

  vm.create = function(form) {
    var newClient = new Clients.api(vm.clientModel);

    newClient.$save(function(res) {
      //reset form
      angular.copy(masterModel, vm.clientModel);
      form.$setPristine();
      form.$setUntouched();
      //alert
      vm.errorInfo.msg = null;
      vm.successInfo.msg = 'Cliente creado con exito';
      vm.successInfo.data = res;
    }, function(err) {
      //alert
      vm.successInfo.msg = null;
      vm.errorInfo.msg = err.data;
    });
  };

  vm.search = function() {
    if (vm.clientSearch.number) {
      vm.searchWord = vm.clientSearch.number;
      getClient(vm.clientSearch.number, 'null');
    } else if (vm.clientSearch.lastName) {
      vm.searchWord = vm.clientSearch.lastName;
      getClient('null', vm.clientSearch.lastName);
    }
  };

  vm.remove = function(client) {
    var confirm = $window.confirm('Quieres eliminar a ' + client.firstName + ' ' + client.lastName + ' ?');

    if (confirm) {
      client.$remove();
      vm.clientList = vm.clientList.filter(function(e) {
        return e._id !== client._id;
      });
    }
  };

  vm.findOne = function() {
    Clients.api.get({
      id: $stateParams.id
    }, function(response) {
      vm.clientModel = response;
    });
  };

  vm.update = function(form){
    vm.clientModel.$update(function(res) {
      //reset form
      form.$setPristine();
      form.$setUntouched();
      //alert
      vm.errorInfo.msg = null;
      vm.successInfo.msg = 'Cliente editado con exito';
      vm.successInfo.data = res;
    }, function(err) {
      //alert
      vm.successInfo.msg = null;
      vm.errorInfo.msg = err.data;
    });
  };

  // functon helpers (private)
  function getClient(number, lastName) {
    Clients.search.query({
      'id': null,
      'number': number,
      'lastName': lastName
    }, function(response){
      vm.clientList = response;
    });  
  }

}

angular
  .module('client')
  .controller('ClientCtrl', ['Clients', '$http', '$window', '$stateParams', ClientCtrl]);
// angular.module('user')
//   .directive('recordAvailabilityValidator', ['$http', 'Users', function($http, Users) {

//     return {
//       require: 'ngModel',
//       link: function(scope, element, attrs, ngModel) {
//         //var apiUrl = attrs.recordAvailabilityValidator;

//         function setAsLoading(bool) {
//           ngModel.$setValidity('recordLoading', !bool);
//         }

//         function setAsAvailable(bool) {
//           ngModel.$setValidity('recordAvailable', bool);
//         }

//         ngModel.$parsers.push(function(value) {
//           if (!value || value.length === 0) return;

//           setAsLoading(true);
//           setAsAvailable(false);

//           // using resource
//           var data = Users.search.get({
//             name: value
//           }, function() {
//             if (data.data === '') {
//               setAsLoading(false);
//               setAsAvailable(true);
//             }
//           });
//           return value;
//         });
//       }
//     };
//   }]);
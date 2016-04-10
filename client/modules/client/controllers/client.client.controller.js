function ClientCtrl(Clients) {
  var vm = this;

  var masterModel, clientModel = {};
  var errorInfo = {
    msg: null,
    data: null
  };
  var successInfo = {
    msg: null,
    data: null
  };

  var create = function() {
    var newClient = new Clients.api(clientModel);

    newClient.$save(function(res) {
      angular.copy(masterModel, clientModel);
      successInfo.msg = 'Cliente creado con exito';
      successInfo.data = res;
    }, function(err) {
      errorInfo.msg = err.data;
    });
  };


  // functon helpers

  // exports (public)
  vm.fns = {
    clientModel: clientModel,
    errorInfo: errorInfo,
    successInfo: successInfo,
    create: create
  };

}

angular
  .module('client')
  .controller('ClientCtrl', ['Clients', ClientCtrl]);
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
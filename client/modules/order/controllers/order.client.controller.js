function OrderCtrl(Orders, Clients, $http, $window, $stateParams) {
  var vm = this;

  vm.orderModel = {};
  vm.orderSearch = {};
  vm.errorInfo = {
    msg: null,
    data: null
  };
  vm.successInfo = {
    msg: null,
    data: null
  };
  vm.solvedOpt = ['No', 'Si'];
  vm.orderStatus = ['Cancelada', 'Asignada', 'Completada'];

  vm.create = function(form) {
    // hardcode attr
    vm.orderModel.client = vm.clientData._id;
    // TODO
    vm.orderModel.tech = {
      id: '1',
      firstName: 'Jesie',
      lastName: 'Pinkman'
    };

    var neworder = new Orders.api(vm.orderModel);

    neworder.$save(function(res) {
      //reset form
      vm.orderModel = {};
      vm.clientData = null;
      vm.clientSearch = {};
      vm.clientList = null;
      form.$setPristine();
      form.$setUntouched();
      //alert
      vm.errorInfo.msg = null;
      vm.successInfo.msg = 'Orden creada con exito';
      vm.successInfo.data = res;
    }, function(err) {
      //alert
      vm.successInfo.msg = null;
      vm.errorInfo.msg = err.data;
    });
  };

  vm.searchClient = function() {
    if (vm.clientSearch.number) {
      vm.searchWord = vm.clientSearch.number;
      getclient(vm.clientSearch.number, 'null');
    } else if (vm.clientSearch.lastName) {
      vm.searchWord = vm.clientSearch.lastName;
      getclient('null', vm.clientSearch.lastName);
    }
  };

  vm.searchOrder = function() {
    if (vm.orderSearch.number) {
      vm.searchWord = vm.orderSearch.number;
      getorder(vm.orderSearch.number, 'null');
    } else if (vm.orderSearch.lastName) {
      vm.searchWord = vm.orderSearch.lastName;
      getorder('null', vm.orderSearch.lastName);
    }
  };

  vm.remove = function(order) {
    var confirm = $window.confirm('Quieres eliminar a ' + order.firstName + ' ' + order.lastName + ' ?');

    if (confirm) {
      order.$remove();
      // vm.orderList = vm.orderList.filter(function(e) {
      //   return e._id !== order._id;
      // });
    }
  };

  vm.findOne = function() {
    Orders.api.get({
      id: $stateParams.id
    }, function(response) {
      vm.orderModel = response;
    });
  };

  vm.update = function(form) {
    // TODO
    vm.orderModel.tech = {
      id: '1',
      firstName: 'Walter',
      lastName: 'White'
    };

    vm.orderModel.$update(function(res) {
      //reset form
      form.$setPristine();
      form.$setUntouched();
      //alert
      vm.errorInfo.msg = null;
      vm.successInfo.msg = 'Orden editada con éxito';
      vm.successInfo.data = res;
    }, function(err) {
      //alert
      vm.successInfo.msg = null;
      vm.errorInfo.msg = err.data;
    });
  };

  // functon helpers (private)
  function getclient(number, lastName) {
    Clients.search.query({
      'id': null,
      'number': number,
      'lastName': lastName
    }, function(response) {
      vm.clientList = response;
    });
  }

  function getorder(number, lastName) {
    Orders.search.query({
      'id': null,
      'number': number,
      'lastName': lastName
    }, function(response) {
      vm.orderList = response;
    });
  }

}

angular
  .module('order')
  .controller('OrderCtrl', ['Orders', 'Clients', '$http', '$window', '$stateParams', OrderCtrl]);
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
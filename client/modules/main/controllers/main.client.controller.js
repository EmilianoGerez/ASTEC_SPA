function mainCtrl(UserServ, Orders, $location, $rootScope) {
	var vm = this;

	// set section name
	$rootScope.$on('$stateChangeStart', function() {
		switch ($location.$$path) {
			case '/':
				vm.currentSection = 'Dashboard';
				break;
			case '/clients':
				vm.currentSection = 'Clientes';
				break;
			case '/orders':
				vm.currentSection = 'Ordenes';
				break;
			case '/users':
				vm.currentSection = 'Usuarios';
				break;
		}
	});


	vm.getCurrentUser = (function() {
		vm.currentUserData = UserServ.getCurrentUserData();
	})();

	vm.logout = function() {
		vm.currentUserData = {};
		UserServ.logout();
	};

	vm.getOrders = function() {
		var user = vm.currentUserData;
		vm.isAdmin = (user.role == 'Admin') ? true : false;

		if (vm.isAdmin) {
			Orders.api.query(function(response) {
				vm.orders = response;
			});
		} else {
			Orders.api.query(function(response) {
				vm.orders = response.filter(function(e) {
					return e.tech.id == user._id;
				});
			});
		}
	};

}

angular
	.module('main')
	.controller('mainCtrl', ['UserServ', 'Orders', '$location', '$rootScope', mainCtrl]);
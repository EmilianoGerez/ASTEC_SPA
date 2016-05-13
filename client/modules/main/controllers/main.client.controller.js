function mainCtrl(UserServ, Orders, $location, $rootScope, $window) {
	var vm = this;

	// set section name
	$rootScope.$on('$stateChangeStart', function() {
		switch ($location.$$path) {
			case '/dashboard':
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

		Orders.api.query(function(response) {
			vm.orders = response.filter(function (e) {
				if (vm.isAdmin) {
					return e.status == 'Asignada';
				}
				return e.status == 'Asignada' && e.tech.id == user._id;
			});
			vm.ordersComplete = response.filter(function (e) {
				return e.status == 'Completada';
			});
		});
	};

	vm.remove = function(order) {
		var confirm = $window.confirm('Quieres eliminar la orden N° #' + order.number + ' ?');
		if (confirm) {
			order.$remove(function(){
                if(order.status === 'Asignada'){
                    vm.orders = vm.orders.filter(function(e) {
                        return e._id !== order._id;
                    });
                }else {
                    vm.ordersComplete = vm.ordersComplete.filter(function(e) {
                        return e._id !== order._id;
                    })
                }
            });
		}
	};

}

angular
	.module('main')
	.controller('mainCtrl', ['UserServ', 'Orders', '$location', '$rootScope', '$window', mainCtrl]);
function mainCtrl(UserServ, Orders) {
	var vm = this;


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
	.controller('mainCtrl', ['UserServ', 'Orders', mainCtrl]);
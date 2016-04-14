function mainCtrl(UserServ, Orders) {
	var vm = this;

	vm.getOrders = function() {
		var payload = UserServ.currentUserData();

		Orders.api.query(function(response) {
			vm.orders = response.filter(function(e) {
				return e.tech.id == payload._id;
			});
		});
	};
	
}

angular
	.module('main')
	.controller('mainCtrl', ['UserServ', 'Orders', mainCtrl]);
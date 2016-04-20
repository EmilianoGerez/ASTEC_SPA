function UserServ(store, jwtHelper, $window, Users) {

	this.getCurrentUserData = function() {
		var token = store.get('jwt');
		if (token) {
			var payload = jwtHelper.decodeToken(token);
			return payload;
		} else {
			return false;
		}
	};

	this.isAdmin = function() {
		var payload = this.getCurrentUserData();
		if (payload.role == 'Admin') {
			return true;
		} else {
			return false;
		}
	};

	this.logout = function() {
		var payload = this.getCurrentUserData();
		Users.logout.get({
			id: payload._id
		}, function() {
			store.remove('jwt');
			$window.location.href = '/';
		});
	};
}

angular
	.module('user')
	.service('UserServ', ['store', 'jwtHelper', '$window', 'Users', UserServ]);
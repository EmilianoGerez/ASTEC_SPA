function UserServ(store, jwtHelper, $window, Users) {

	this.getCurrentUserData = function() {
		var token = store.get('jwt');
		if (token) {
			var payload = jwtHelper.decodeToken(token);
			return payload;
		}else {
			return false;
		}
	};

	this.logout = function() {
		var decoded = this.getCurrentUserData();
		Users.logout.get({
			id: decoded._id
		}, function() {
			store.remove('jwt');
			$window.location.href = '/';
		});
	};
}

angular
	.module('user')
	.service('UserServ', ['store', 'jwtHelper', '$window', 'Users', UserServ]);
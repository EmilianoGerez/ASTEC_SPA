function UserServ(store, jwtHelper) {

	this.currentUserData = function() {
      var token = store.get('jwt');
      if (token) {
        var payload = jwtHelper.decodeToken(token);
        return payload;
      } else {
        return false;
      }
    };
}

angular
.module('user')
.service('UserServ', ['store', 'jwtHelper', UserServ]);
function mainCtrl($location) {
	var vm = this;

	var currentPath = $location.path();
	vm.isHome = (currentPath == '/') ? true : false;
}

angular
	.module('main')
	.controller('mainCtrl', ['$location', mainCtrl]);
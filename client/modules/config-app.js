var appConfiguration = (function() {
	var appName = 'main';
	var appDependencies = ['ngResource', 'ui.router', 'angular-jwt', 'angular-storage', 'ngMessages'];

	//Method for add new modules
	var registerModule = function(moduleName, moduleDependencies) {
		// Create module
		angular.module(moduleName, moduleDependencies || []);

		// Add the new module to the angular config file
		angular.module(appName).requires.push(moduleName);
	};

	return {
		appName: appName,
		appDependencies: appDependencies,
		registerModule: registerModule
	}
}) ();
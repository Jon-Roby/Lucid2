angular.module('iconsService', [])

.factory('Icons', function($http) {

	// create a new object
	var iconsFactory = {};

	iconsFactory.getIcons = function() {
		return $http.get('api/users/icons');
	};

	return iconsFactory;

});

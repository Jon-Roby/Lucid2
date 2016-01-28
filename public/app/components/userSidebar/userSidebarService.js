angular.module('userSidebarService', [])

.factory('UserSidebar', function($http) {

	var menuFactory = {};

	menuFactory.getUserId = function(id) {
		return $http.get('/api/users/' + id);
	};

	return menuFactory;

});

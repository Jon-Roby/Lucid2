

angular.module('userDisplayService', [])

.factory('UserDisplay', function($http) {

	// create a new object
	var userDisplayFactory = {};

	// get a single user
	userDisplayFactory.get = function(id) {
		return $http.get('/api/users/' + id);
	};

	// get all users
	userDisplayFactory.all = function() {
		return $http.get('/api/users/');
	};

	// create a user
	userDisplayFactory.create = function(userData) {
		return $http.post('/api/users/', userData);
	};

	// update a user
	userDisplayFactory.update = function(id, userData) {
		return $http.put('/api/users/' + id, userData);
	};

	// delete a user
	userDisplayFactory.delete = function(id) {
		return $http.delete('/api/users/' + id);
	};

	userDisplayFactory.uploadPhoto = function(id, photo) {
		console.log("hasdfads")
		return $http.put('/api/users/' + id + '/profile/', photo);
	};

	// return our entire userDisplayFactory object
	return userDisplayFactory;

});

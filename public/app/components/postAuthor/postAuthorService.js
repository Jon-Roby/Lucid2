angular.module('postAuthorService', [])

.factory('PostAuthor', function($http) {

	// create a new object
	var postAuthorFactory = {};

	postAuthorFactory.get = function(id) {
		return $http.get('/api/posts/' + id);
	};

	postAuthorFactory.getUserId = function(id) {
		return $http.get('/api/users/' + id);
	};

  postAuthorFactory.subscribeToAuthor = function(userId, userData) {
    return $http.put('/api/users/' + userId._id + '/subscribe', userData);
  };

	return postAuthorFactory;

});

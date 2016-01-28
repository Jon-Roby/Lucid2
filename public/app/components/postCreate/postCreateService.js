angular.module('postCreateService', [])

.factory('PostCreate', function($http) {

	var postFactory = {};

	postFactory.get = function(id) {
		return $http.get('/api/posts/' + id);
	};

	postFactory.getUserId = function(id) {
		return $http.get('/api/users/' + id);
	};

	postFactory.create = function(postData) {
		return $http.post('/api/posts/', postData);
	};

	postFactory.update = function(id, postData) {
		return $http.put('/api/posts/' + id, postData);
	};

	// change to api/posts/post_id/delete
	postFactory.delete = function(id) {
		return $http.delete('/api/posts/' + id);
	};

	return postFactory;

});

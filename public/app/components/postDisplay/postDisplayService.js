angular.module('postDisplayService', [])

.factory('PostDisplay', function($http) {

	var postFactory = {};

	postFactory.get = function(id) {
		return $http.get('/api/posts/' + id);
	};

	postFactory.getUserId = function(id) {
		return $http.get('/api/users/' + id);
	};

	postFactory.upvotePost = function(id) {
		return $http.put('/api/posts/' + id + '/upvote');
	};

	postFactory.bookmark = function(userId, postData) {
		return $http.put('/api/users/' + userId + '/bookmark', postData);
	};

	postFactory.delete = function(id) {
		return $http.delete('/api/posts/post/' + id);
	};

	return postFactory;

});

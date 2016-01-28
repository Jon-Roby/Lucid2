angular.module('postsDisplayService', [])

.factory('PostsDisplay', function($http) {

	var postFactory = {};

	postFactory.all = function() {
		return $http.get('/api/posts/');
	};

	postFactory.getTrendingPosts = function() {
		return $http.get('/api/posts/trending');
	};

	postFactory.getPopularPosts = function() {
		return $http.get('/api/posts/popular');
	};

	postFactory.getNewPosts = function() {
		return $http.get('/api/posts/new');
	};


	return postFactory;

});

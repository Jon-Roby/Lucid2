angular.module('postService', [])

.factory('Post', function($http) {

	// create a new object
	var postFactory = {};

	// get all posts
	postFactory.all = function() {
		return $http.get('/api/posts/');
	};

	// get a single post
	postFactory.get = function(id) {
		return $http.get('/api/posts/' + id);
	};


	// This doesn't seem appropriate to be here. A better place?
	postFactory.getUserId = function(id) {
		return $http.get('/api/users/' + id);
	};

	postFactory.upvotePost = function(id) {
		return $http.put('/api/posts/' + id + '/upvote');
	};

	postFactory.bookmark = function(userId, postData) {
		return $http.put('/api/users/' + userId + '/bookmark', postData);
	};

	postFactory.subscribeToAuthor = function(userId, userData) {
		return $http.put('/api/users/' + userId._id + '/subscribe', userData);
	};

	postFactory.getIcons = function() {
		return $http.get('api/users/icons');
	};

	// postFactory.favoriteAuthorPost = function(id, action) {
	// 	return $http.put('/api/users/' + id + '/' + action)
	// }

	// create a post
	postFactory.create = function(postData) {
		return $http.post('/api/posts/', postData);
	};

	// update a post
	postFactory.update = function(id, postData) {
		return $http.put('/api/posts/post/' + id, postData);
	};

	// delete a post
	postFactory.delete = function(id) {
		return $http.delete('/api/posts/post/' + id);
	};

	// return our entire postFactory object
	return postFactory;

});

// angular.module('postCtrl', ['postService'])
//
// 	.controller('postController', function(Post, Auth) {
//
// 		var vm = this;
// 		vm.processing = true;
//
// 		Auth.getUser()
// 			.then(function(data) {
// 				Post.getUserId(data.data._id)
// 					.success(function(data) {
// 						vm.userData = data;
// 					});
// 			});
//
// 		Post.all()
// 			.success(function(data) {
//
// 				vm.processing = false;
// 				vm.posts = data;
// 			});
//
// 		Post.getIcons()
// 			.success(function(data) {
// 				vm.icons = data;
// 			});
// 	})
//
// 	// controller applied to post creation page
// 	.controller('postCreateController', function(Post) {
//
// 		var vm = this;
//
// 		// variable to hide/show elements of the view
// 		// differentiates between create or edit pages
// 		vm.type = 'create';
//
// 		// function to create a post
// 		vm.savePost = function() {
// 			vm.processing = true;
// 			vm.message = '';
//
// 			// use the create function in the postService
// 			Post.create(vm.postData)
// 				.success(function(data) {
// 					vm.processing = false;
// 					vm.postData = {};
// 					vm.message = data.message;
// 					$location.path('/posts');
// 				});
//
// 		};
//
// 	})
//
// 	// controller applied to post edit page
// 	.controller('postEditController', function($routeParams, Post) {
//
// 		var vm = this;
//
// 		// variable to hide/show elements of the view
// 		// differentiates between create or edit pages
// 		vm.type = 'edit';
//
// 		// get the post data for the post you want to edit
// 		// $routeParams is the way we grab data from the URL
// 		Post.get($routeParams.post_id)
// 			.success(function(data) {
//
// 				vm.postData = data;
// 			});
//
// 		// function to save the post
// 		vm.savePost = function() {
// 			vm.processing = true;
// 			vm.message = '';
//
// 			// call the postService function to update
// 			Post.update($routeParams.post_id, vm.postData)
// 				.success(function(data) {
// 					vm.processing = false;
//
// 					// clear the form
// 					vm.postData = {};
//
// 					// bind the message from our API to vm.message
// 					vm.message = data.message;
// 				});
// 		};
//
//
// 	})
//
// 	.controller('postViewController', function($routeParams, Post, Auth) {
//
// 		var vm = this;
//
// 		Post.get($routeParams.post_id)
// 			.success(function(data) {
// 				vm.post = data;
//
//
// 				Post.getUserId(vm.post.authorId)
// 					.success(function(data) {
//
// 						vm.post.userData = data;
//
// 					});
//
// 			});
//
// 			Auth.getUser()
// 				.then(function(data) {
// 					// vm.user = data.data._id
// 					Post.getUserId(data.data._id)
// 						.success(function(data) {
//
// 							vm.userData = data;
// 							// console.log(vm.userData);
// 						});
// 				});
//
// 		// function to delete a post
// 		vm.deletePost = function(id) {
//
// 			if (vm.userData._id === vm.post.authorId) {
// 				Post.delete(id)
// 					.success(function(data) {
// 						Post.all()
// 							.success(function(data) {
// 								vm.processing = false;
// 								vm.posts = data;
// 							});
// 					});
// 			}
// 		};
//
// 		vm.upvotePost = function() {
//
// 			Post.upvotePost(vm.post._id)
// 				.success(function(data) {
//
// 					// Post.favoriteAuthorPost(vm.post.authorId, action)
// 					// 	.success(function(data) {
// 					// 	});
//
// 					// THIS SEEMS TO BE BAD
// 					Post.get($routeParams.post_id)
// 						.success(function(data) {
// 							vm.post = data;
//
// 							Post.getUserId(vm.post.authorId)
// 								.success(function(data) {
//
// 									vm.post.userData = data;
// 								});
//
// 						});
// 				});
//
//
// 		};
//
// 		vm.bookmark = function() {
// 			// console.log(vm.userData._id);
// 			// console.log(vm.post._id);
//
//
// 			Post.bookmark(vm.userData._id, vm.post)
// 				.success(function(data) {
//
// 					Auth.getUser()
// 						.then(function(data) {
// 							// vm.user = data.data._id
// 							Post.getUserId(data.data._id)
// 								.success(function(data) {
//
// 									vm.userData = data;
//
// 								});
// 						});
// 				});
//
// 		};
//
// 		vm.subscribeToAuthor = function() {
//
// 			Post.subscribeToAuthor(vm.userData, vm.post)
// 				.success(function(data) {
// 					Auth.getUser()
// 						.then(function(data) {
// 							Post.getUserId(data.data._id)
// 								.success(function(data) {
// 									vm.userData = data;
// 								});
// 						});
// 				});
// 		};
//
//
//
// 	});

angular.module('postDisplayCtrl', ['postDisplayService'])

	.controller('postDisplayController', function($stateParams, PostDisplay, Auth) {

		var vm = this;



		// PostIds and AuthorIds are stored as an object key and object value respectively
		// They are then stored in an array
		// To quickly pull these a couple of functions are created
		var getObjectKey = function(object) {
			for (var key in object) {
				return key;
			}
		}

		var arrayIncludesValue = function(array, value) {
			for (var i = 0; i < array.length; i++) {
				if (getObjectKey(array[i]) === value) {
					return true;
				}
			}
			return false;
		}

		PostDisplay.get($stateParams.post_id)
			.success(function(data) {
				vm.postDetails = data;
			});

		// get the viewer (viewing user)
    Auth.getUser()
      .then(function(viewer) {

				// gets the viewer's data
				// This is necessary to determine like/upvote, favorite, and bookmark
				PostDisplay.getUserId(viewer.data._id)
          .success(function(viewerObject) {
            vm.viewerDetails = viewerObject;

						vm.likes_count = vm.postDetails.upvotes.length;
						vm.viewerLiked = vm.postDetails.upvotes.includes(vm.viewerDetails._id);

						var post_id = vm.postDetails._id;
						vm.viewerBookmarked = arrayIncludesValue(vm.viewerDetails.bookmarks, post_id);
						vm.viewerFavorited = arrayIncludesValue(vm.viewerDetails.favorites, post_id);
          });
      });

		// REWORK THIS NONSENSE
		vm.deletePost = function(id) {
			// vm.viewerDetails ....     vm.postDetails.authorId
			if (vm.userData._id === vm.post.authorId) {
				PostDisplay.delete(id)
					.success(function(data) {
						PostDisplay.all()
							.success(function(data) {
								vm.processing = false;
								// vm.posts????
								vm.posts = data;
							});
					});
			}
		};

		vm.upvotePost = function() {
			PostDisplay.upvotePost(vm.postDetails._id)
				.success(function(data) {
					vm.postDetails = data.post;

					vm.likes_count = vm.postDetails.upvotes.length;
					vm.viewerLiked = vm.postDetails.upvotes.includes(vm.viewerDetails._id);
				});
		};

		vm.favoritePost = function() {
			PostDisplay.favoritePost(vm.viewerDetails, vm.postDetails)
				.then(function(data) {
					console.log(data);
				})
		}

		// vm.favoritePost = function() {
		// 	PostDisplay.favoritePost(vm.viewerDetails._id, vm.postDetails._id)
		// 		.success(function(data) {
		// 			// return a data.post
		// 			// vm.postDetails = data[0];
		//
		// 			// return a data.viewer
		// 			vm.viewerDetails = data[0];
		//
		// 			// return a data.author!
		// 			console.log(data);
		// 			vm.favorites_count = vm.postDetails.favorites.length;
		// 			vm.viewerFavorited = arrayIncludesValue(vm.viewerDetails.favorites, vm.postDetails._id);
		// 		});
		// };

		vm.bookmark = function() {
			PostDisplay.bookmark(vm.viewerDetails._id, vm.postDetails)
				.success(function(viewerObject) {

					// Check if the viewer's bookmarks include the post_id
					// Set the result to vm.viewerBookmarked
					vm.viewerDetails = viewerObject.user;
					vm.viewerBookmarked = arrayIncludesValue(vm.viewerDetails.bookmarks, vm.postDetails._id);
				});
		};

		// vm.subscribeToAuthor = function() {
		//
		// 	PostDisplay.subscribeToAuthor(vm.userData, vm.post)
		// 		.success(function(data) {
		// 			Auth.getUser()
		// 				.then(function(data) {
		// 					PostDisplay.getUserId(data.data._id)
		// 						.success(function(data) {
		// 							vm.userData = data;
		// 						});
		// 				});
		// 		});
		// };

	});

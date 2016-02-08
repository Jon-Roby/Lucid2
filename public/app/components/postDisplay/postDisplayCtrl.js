angular.module('postDisplayCtrl', ['postDisplayService'])

	.controller('postDisplayController', function($stateParams, PostDisplay, Auth, $rootScope) {

		var vm = this;

		var arrayHasValue = function(array, value) {
			for (var i = 0; i < array.length; i++) {
				if (array[i].id === value) {
					return true;
				}
			}
			return false;
		}

		PostDisplay.get($stateParams.post_id)
			.success(function(data) {
				vm.postDetails = data;

				PostDisplay.getUserId(vm.postDetails.authorId)
					.success(function(authorObject) {
						vm.authorDetails = authorObject;
					});
			});



		// get the viewer (viewing user)
    Auth.getUser()
      .then(function(viewer) {

				// gets the viewer's data
				// This is necessary to determine like/upvote, favorite, and bookmark
				PostDisplay.getUserId(viewer.data._id)
          .success(function(viewerObject) {
            vm.viewerDetails = viewerObject;

						vm.upvotes_count = vm.postDetails.upvotes.length;
						vm.viewerUpvoted = vm.postDetails.upvotes.includes(vm.viewerDetails._id);

						var post_id = vm.postDetails._id;
						vm.viewerBookmarked = arrayHasValue(vm.viewerDetails.bookmarks, post_id);
						vm.viewerFavorited = arrayHasValue(vm.viewerDetails.favorites, post_id);
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
					// $rootScope.$broadcast('alterAuthorUpvotes', data.author.upvotes);
					vm.authorDetails.upvotes = data.author.upvotes;
					vm.postDetails = data.post;
					vm.upvotes_count = vm.postDetails.upvotes.length;
					console.log(vm.postDetails.upvotes.length);
					console.log(vm.upvotes_count);
					vm.viewerUpvoted = vm.postDetails.upvotes.includes(vm.viewerDetails._id);
				});
		};

		vm.favoritePost = function() {
			PostDisplay.favoritePost(vm.viewerDetails, vm.postDetails)
				.then(function(object) {

					$rootScope.$broadcast('updateFavorites', object.data.user.favorites);

					vm.viewerDetails = object.data.user;
					vm.viewerFavorited = arrayHasValue(vm.viewerDetails.favorites, vm.postDetails._id);
				})
		}

		vm.bookmark = function() {
			PostDisplay.bookmark(vm.viewerDetails._id, vm.postDetails)
				.success(function(viewerObject) {

					$rootScope.$broadcast('updateBookmarks', viewerObject.user.bookmarks);

					// Check if the viewer's bookmarks include the post_id
					// Set the result to vm.viewerBookmarked
					vm.viewerDetails = viewerObject.user;
					vm.viewerBookmarked = arrayHasValue(vm.viewerDetails.bookmarks, vm.postDetails._id);
				});
		};

		vm.subscribeToAuthor = function() {
			console.log("ches")
			var subscriptionDetails = {};
			subscriptionDetails.authorDetails = vm.authorDetails;
			subscriptionDetails.viewerDetails = vm.viewerDetails;
			PostDisplay.subscribeToAuthor(subscriptionDetails)
				.success(function(data) {
					console.log("casdf")
					$rootScope.$broadcast('updateSubscriptions', data.viewerObject.subscriptions);
					// vm.userData = data;
				});
		};

	});

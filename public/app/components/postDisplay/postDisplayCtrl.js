angular.module('postDisplayCtrl', ['postDisplayService'])

	.controller('postDisplayController', function($stateParams, PostDisplay, Auth) {

		var vm = this;

    Auth.getUser()
      .then(function(data) {
        PostDisplay.getUserId(data.data._id)
          .success(function(data) {
            vm.userData = data;
          });
      });

		PostDisplay.get($stateParams.post_id)
			.success(function(data) {
				vm.post = data;


        // // Is this still necessary? This is stored with the post?
        // // Make sure to make postAuthor clickable to go stright to profile
				// Post.getUserId(vm.post.authorId)
				// 	.success(function(data) {
				//
				// 		vm.post.userData = data;
				//
				// 	});


			});

		vm.deletePost = function(id) {

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
			console.log(vm.post._id);
			PostDisplay.upvotePost(vm.post._id)
				.success(function(data) {

					// THIS SEEMS TO BE BAD
					PostDisplay.get($stateParams.post_id)
						.success(function(data) {
							vm.post = data;

							// Post.getUserId(vm.post.authorId)
							// 	.success(function(data) {
							//
							// 		vm.post.userData = data;
							// 	});

						});
				});


		};

		vm.bookmark = function() {
			// console.log(vm.userData._id);
			// console.log(vm.post._id);


			PostDisplay.bookmark(vm.userData._id, vm.post)
				.success(function(data) {

					Auth.getUser()
						.then(function(data) {
							// grab updated user data
							PostDisplay.getUserId(data.data._id)
								.success(function(data) {

									vm.userData = data;

								});
						});
				});

		};

		vm.subscribeToAuthor = function() {

			PostDisplay.subscribeToAuthor(vm.userData, vm.post)
				.success(function(data) {
					Auth.getUser()
						.then(function(data) {
							PostDisplay.getUserId(data.data._id)
								.success(function(data) {
									vm.userData = data;
								});
						});
				});
		};

	});

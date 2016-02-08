angular.module('postsDisplayCtrl', ['postsDisplayService'])

	.controller('postsDisplayController', function(PostsDisplay, Auth, $location) {
		var vm = this;
		vm.processing = true;

		// Auth.getUser()
		// 	.then(function(data) {
		// 		PostsDisplay.getUserId(data.data._id)
		// 			.success(function(data) {
		// 				vm.userData = data;
		// 			});
		// 	});

		// vm.selected = "";
		//
		// vm.getSelected = function() {
		// 	vm.selected = PostsOptions.getSelected();
		// };
		// vm.setSelected = function(value) {
    //   PostsOptions.setSelected(value);
		// 	vm.selected = PostsOptions.getSelected(value);
    // };




		// case switch statement
		
		if ($location.path() === "/posts/trending") {
			PostsDisplay.getTrendingPosts()
				.success(function(data) {
					vm.processing = false;
					vm.posts = data;
				});
		} else if ($location.path() === "/posts/popular") {
			PostsDisplay.getPopularPosts()
				.success(function(data) {
					vm.processing = false;
					vm.posts = data;
				});
		} else if ($location.path() === "/posts/new") {
			PostsDisplay.getNewPosts()
				.success(function(data) {
					vm.processing = false;
					vm.posts = data;
				});
		} else {
			console.log("hello");
		}








	});

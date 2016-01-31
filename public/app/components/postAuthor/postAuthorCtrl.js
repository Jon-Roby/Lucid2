angular.module('postAuthorCtrl', ['postAuthorService'])

	.controller('postAuthorController', function(PostAuthor, Auth, $stateParams, $rootScope) {

		var vm = this;
		vm.processing = true;

		$rootScope.$on('someEvent', function(event, mass) { vm.post.userData.upvotes = mass; });


		Auth.getUser()
			.then(function(data) {
				PostAuthor.getUserId(data.data._id)
					.success(function(data) {
						vm.userData = data;

						//Send data to sharedDetailsService
					});
			});
		// Grab the params of post
		PostAuthor.get($stateParams.post_id)
			.success(function(data) {
				vm.post = data;
				// grab the user of the params of post
				PostAuthor.getUserId(vm.post.authorId)
					.success(function(data) {
						vm.post.userData = data;

						//Send data to sharedDetails service
					});
			});

			vm.subscribeToAuthor = function() {

				PostAuthor.subscribeToAuthor(vm.userData, vm.post)
					.success(function(data) {
						Auth.getUser()
							.then(function(data) {
								PostAuthor.getUserId(data.data._id)
									.success(function(data) {
										vm.userData = data;
									});
							});
					});
			};
	});

angular.module('postAuthorCtrl', ['postAuthorService'])

	.controller('postAuthorController', function(PostAuthor, Auth, $stateParams) {

		var vm = this;
		vm.processing = true;

		Auth.getUser()
			.then(function(data) {
				PostAuthor.getUserId(data.data._id)
					.success(function(data) {
						vm.userData = data;
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

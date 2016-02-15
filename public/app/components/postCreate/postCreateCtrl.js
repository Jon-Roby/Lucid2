angular.module('postCreateCtrl', ['postCreateService'])
// controller applied to post creation page
	.controller('postCreateController', function(PostCreate) {

		var vm = this;
		vm.type = 'create';

		// $sceDelegateProvider.resourceUrlWhitelist([
		//    // Allow same origin resource loads.
		//    '',
		//    // Allow loading from our assets domain.  Notice the difference between * and **.
		//    ]);
		

		vm.savePost = function() {
			vm.processing = true;
			vm.message = '';
			// // use the create function in the postService
			PostCreate.create(vm.postData)
				.success(function(data) {
					vm.processing = false;
					vm.postData = {};
					vm.message = data.message;
				});

		};

	})

	// // controller applied to post edit page
	.controller('postEditController', function($stateParams, PostCreate) {

		var vm = this;

		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		vm.type = 'edit';

		// get the post data for the post you want to edit
		// $stateParams is the way we grab data from the URL
		PostCreate.get($stateParams.post_id)
			.success(function(data) {

				vm.postData = data;
			});

		// function to save the post
		vm.savePost = function() {
			vm.processing = true;
			vm.message = '';

			// call the postService function to update
			PostCreate.update($stateParams.post_id, vm.postData)
				.success(function(data) {
					vm.processing = false;

					// clear the form
					vm.postData = {};

					// bind the message from our API to vm.message
					vm.message = data.message;
				});
		};


	});

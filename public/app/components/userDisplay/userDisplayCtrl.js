angular.module('userDisplayCtrl', ['userDisplayService'])

.controller('userDisplayController', function(UserDisplay, $stateParams) {

	var vm = this;
	vm.processing = true;

	UserDisplay.get($stateParams.user_id)
		.success(function(data) {
			vm.userData = data;
		});

		vm.add = function() {

		  var file = document.getElementById('file').files[0];
		  var reader = new FileReader();

		  reader.onloadend = function(event) {
		    var data = event.target.result;
				var photo = {photo: data};
				UserDisplay.uploadPhoto($stateParams.user_id, photo);

		  };
		  reader.readAsDataURL( file );
		};







  // vm.saveUser = function() {
	// 	vm.processing = true;
	// 	vm.message = '';
  //
	// 	User.create(vm.userData)
	// 		.success(function(data) {
	// 			vm.processing = false;
	// 			vm.userData = {};
	// 			vm.message = data.message;
	// 		});
  //
	// };
  //
	// vm.deleteUser = function(id) {
	// 	vm.processing = true;
	// 	User.delete(id)
	// 		.success(function(data) {
	// 			User.all()
	// 				.success(function(data) {
	// 					vm.processing = false;
	// 					vm.users = data;
	// 				});
  //
	// 		});
	// };
  //
  // vm.saveUser = function() {
	// 	vm.processing = true;
	// 	vm.message = '';
	// 	User.update($routeParams.user_id, vm.userData)
	// 		.success(function(data) {
	// 			vm.processing = false;
	// 			vm.userData = {};
	// 			vm.message = data.message;
	// 		});
	// };

});

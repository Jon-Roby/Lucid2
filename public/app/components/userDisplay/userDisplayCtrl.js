angular.module('userDisplayCtrl', ['userDisplayService'])

.controller('userDisplayController', function(UserDisplay, $stateParams) {

	var vm = this;
	vm.processing = true;

	UserDisplay.get($stateParams.user_id)
		.success(function(data) {
			vm.userData = data;
		});

	vm.uploadPhoto = function() {
		// Must be turned into object for AJAX request
		console.log(vm.uploadedPhoto);
		var uploadedPhoto = {'photo': vm.uploadedPhoto};
		UserDisplay.uploadPhoto($stateParams.user_id, uploadedPhoto)
			.success(function(data) {
				vm.message = data.message;
			});
	};

	// vm.add = function(){
  // 	var file = document.getElementById('file').files[0];
  //   var fileReader = new FileReader();
	//
	// 	// console.log(fileReader.readAsArrayBuffer(file));
	//
	// 	fileReader.onloadend = function(event)	{
	//     var data = event.target.result;
	//     	//send you binary data via $http or $resource or do anything else with it
	// 			console.log(data);
	// 			console.log("here");
	// 	}
	//
	// 	fileReader.readAsBinaryString(file);

		vm.add = function(){
		  var f = document.getElementById('file').files[0],
		      r = new FileReader();
		  	r.onloadend = function(e){
		    var data = e.target.result;
				var photo = {"photo": data};
				UserDisplay.uploadPhoto($stateParams.user_id, photo)
		    //send you binary data via $http or $resource or do anything else with it
		  }
		  r.readAsBinaryString(f);
		}


		// console.log("here1");
		//
		// var photo = {'photo': file.name};

		// UserDisplay.uploadPhoto($stateParams.user_id, photo)
		// 	.success(function(data) {
		// 		vm.message = data.message;
		// 	});







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

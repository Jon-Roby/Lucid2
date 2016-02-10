angular.module('userDisplayCtrl', ['userDisplayService'])

.controller('userDisplayController', function(UserDisplay, $stateParams, FileUploader) {

	var vm = this;
	vm.processing = true;

	UserDisplay.get($stateParams.user_id)
		.success(function(data) {
			vm.userData = data;
		});

	

	vm.uploader = new FileUploader();
	vm.upload = function() {
		console.log(vm.uploader.queue[0].formData);
		console.log(vm.uploader.queue[0].file);

		// var photo = {file: vm.uploader.queue[0]._file} 

		UserDisplay.uploadPhoto($stateParams.user_id, vm.uploader.queue[0].file);
	}

	vm.uploadPhoto = function() {
		// Must be turned into object for AJAX request
		console.log(vm.uploadedPhoto);


		// var uploadedPhoto = {'photo': vm.uploadedPhoto};
		// UserDisplay.uploadPhoto($stateParams.user_id, uploadedPhoto)
		// 	.success(function(data) {
		// 		vm.message = data.message;
		// 	});
	};

	vm.processForm = function() {
		var reader = new FileReader();
    reader.onload = function (e) {
        var data = this.result;
    }
    reader.readAsDataURL( file );
	}


	vm.add = function(){
	
		  var file = document.getElementById('file').files[0];
		  var reader = new FileReader();
		  console.log(file);
		 	reader.readAsDataURL( file );
		 	console.log(reader);
		 	console.log(reader.result);
		  // Cloudinary.upload(files, {}, function(err, res) {
    //   	console.log(res.url);
    // 	});

		  // var form = new FormData();
		  // form.append('file', file);
		  // console.log(form);
		  
		  // UserDisplay.uploadPhoto($stateParams.user_id, form)
		  	 
		  // r.onloadend = function(e) {
		  //   var data = e.target.result;
		  //   console.log(data);
				// var photo = {photo: data};
				// UserDisplay.uploadPhoto($stateParams.user_id, photo)
		    
		  // }
		  // reader.readAsBinaryString(file);

		}
	

		// vm.add = function(){
	
		//   var f = document.getElementById('file').files[0],
		//       r = new FileReader();
		  	 
		//   	r.onloadend = function(e){
		//     var data = e.target.result;
		//     console.log(data);
		// 		var photo = {photo: data};
		// 		UserDisplay.uploadPhoto($stateParams.user_id, photo)
		//     //send you binary data via $http or $resource or do anything else with it
		//   }
		//   r.readAsBinaryString(f);
		// }

		vm.add = function(){
	
		  var file = document.getElementById('file').files[0];
		  var reader = new FileReader();
		  	 
		  reader.onloadend = function(event) {
		    var data = event.target.result;
		    console.log("a")
		    console.log(data);
		    console.log("b")
		    console.log(reader);
				// var photo = {photo: data};
				// UserDisplay.uploadPhoto($stateParams.user_id, photo)
		    //send you binary data via $http or $resource or do anything else with it
		  }
		  reader.readAsDataURL( file );
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

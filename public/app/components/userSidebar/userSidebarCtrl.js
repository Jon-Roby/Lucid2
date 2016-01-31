angular.module('userSidebarCtrl', ['userSidebarService'])

	.controller('userSidebarController', function(UserSidebar, Auth) {

		var vm = this;
		vm.processing = true;

		Auth.getUser()
			.then(function(data) {
				UserSidebar.getUserId(data.data._id)
					.success(function(data) {
						vm.userData = data;
					});
			});
	});

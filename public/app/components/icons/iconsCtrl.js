angular.module('iconsCtrl', ['iconsService'])

	.controller('iconsController', function(Icons, Auth) {

		var vm = this;
		vm.processing = true;

    Icons.getIcons()
      .success(function(data) {
        vm.icons = data;
      });

		vm.showPopover = function() {
  		vm.popoverIsVisible = true;
		};

		vm.hidePopover = function () {
		  vm.popoverIsVisible = false;
		};

	});

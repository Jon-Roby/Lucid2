angular.module('userSidebarCtrl', ['userSidebarService'])

	.controller('userSidebarController', function(UserSidebar, Auth, $rootScope) {

		var vm = this;
		vm.processing = true;

		$rootScope.$on('updateBookmarks', function(event, bookmarks) { vm.userData.bookmarks = bookmarks; });
		$rootScope.$on('updateFavorites', function(event, favorites) { vm.userData.favorites = favorites; });

		// $rootScope.$on('alterAuthorUpvotes', function(event, alter) { vm.post.userData.upvotes = alter; });

		// This updates on clicking the subscription of author in the author postAuthorView.html
		$rootScope.$on('updateSubscriptions', function(event, subscriptions) { vm.userData.subscriptions = subscriptions; });

		Auth.getUser()
			.then(function(data) {
				UserSidebar.getUserId(data.data._id)
					.success(function(data) {
						vm.userData = data;
					});
			});
	});

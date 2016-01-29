angular.module('myApp',

[
	'app.routes',
	'ngAnimate',
	'angularMoment',
	'authService',
	'mainCtrl',

	// 'postsOptionsService',
	// 'userCtrl',
	// 'userService',
	'sharedDetailsService',
	'postsDisplayCtrl',
	'postsDisplayService',
	'iconsCtrl',
	'iconsService',
	'userSidebarCtrl',
	'userSidebarService',

	'postDisplayCtrl',
	'postDisplayService',
	'postAuthorCtrl',
	'postAuthorService',

	'postCreateCtrl',
	'postCreateService',

	'userDisplayCtrl',
	'userDisplayService'
])

.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
});

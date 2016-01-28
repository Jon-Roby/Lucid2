angular.module('mainCtrl', [])

  .controller('mainController', function($rootScope, $location, Auth, $state) {

  	var vm = this;

  	vm.loggedIn = Auth.isLoggedIn();

  	$rootScope.$on('$routeChangeStart', function() {
  		vm.loggedIn = Auth.isLoggedIn();

  		Auth.getUser()
  			.then(function(data) {
  				vm.user = data.data;
  			});
    });

    vm.selected = "";


    // case switch statement

		if ($location.path() === "/posts/trending") {
			vm.sliderMargin = 'navbar-options-left';
		} else if ($location.path() === "/posts/popular") {
			vm.sliderMargin = 'navbar-options-middle';
		} else if ($location.path() === "/posts/new") {
			vm.sliderMargin = 'navbar-options-right';
		} else {
			vm.sliderMargin = 'navbar-options-none';
		}

    // vm.sliderMargin = 'navbar-options-right';

    vm.switchPage = function(page) {
      $state.go(page)
    }


		// vm.getSelected = function() {
    //
		// 	vm.selected = PostsOptions.getSelected();
		// 	// console.log("I am getting something " + vm.selected);
		// };
		// vm.setSelected = function(value) {
    //   PostsOptions.setSelected(value);
		// 	vm.selected = PostsOptions.getSelected(value);
    // };
		// console.log(vm.selected);


    // console.log("main.selectedTab === vm.recent: " + (vm.selectedTab === vm.recent).toString());
    // console.log("main.selectedTab === vm.popular: " + (vm.selectedTab === vm.popular).toString());
		// vm.switchTab = function(tab) {
		// 	vm.selectedTab = tab;
    //
    //
		// };



  	vm.signup = function() {
  		vm.processing = true;
  		vm.error = '';

  		Auth.register(vm.loginData.name, vm.loginData.username, vm.loginData.password)
  			.success(function(data) {
  				vm.processing = false;
  				if (data.success) {
  					$location.path('/posts');
  				} else {
  					vm.error = data.message;
  				}
  	    });
  	  };

  	vm.login = function() {
  		vm.processing = true;
  		vm.error = '';

      Auth.logout();

  		Auth.login(vm.loginData.username, vm.loginData.password)
  			.success(function(data) {

  				vm.processing = false;
  				if (data.success) {
  					$location.path('/posts');
  				} else {
  					vm.error = data.message;
          }
  			});
  	};

  	vm.logout = function() {

  		Auth.logout();
  		vm.user = '';

  		// $state.go('posts');
  	};
});

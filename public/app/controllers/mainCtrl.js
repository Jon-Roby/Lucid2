angular.module('mainCtrl', [])

  .controller('mainController', function($rootScope, $location, Auth, $state) {

  	var vm = this;

  	vm.loggedIn = Auth.isLoggedIn();

  	$rootScope.$on('$stateChangeSuccess', function() {
  		vm.loggedIn = Auth.isLoggedIn();

  		Auth.getUser()
  			.then(function(data) {
  				vm.user = data.data;
  			});

      switch($location.path()) {
        case "/posts/trending":
          vm.showSliderMargin = true;
          break;
        case "/posts/popular":
          vm.showSliderMargin = true;
          break;
        case "/posts/new":
          vm.showSliderMargin = true;
          break;
        default:
          vm.showSliderMargin = false;
          break;
      }
    });

    vm.selected = "";

    switch($location.path()) {
      case "/posts/trending":
        vm.sliderMargin = 'navbar-options-left';
        break;
      case "/posts/popular":
        vm.sliderMargin = 'navbar-options-middle';
        break;
      case "/posts/new":
        vm.sliderMargin = 'navbar-options-right';
        break;
      default:
        vm.sliderMargin = 'navbar-options-none';
        break;
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

  	vm.doLogin = function() {
  		vm.processing = true;
  		vm.error = '';
      Auth.logout();

  		Auth.login(vm.loginData.username, vm.loginData.password)
  			.success(function(data) {

  				vm.processing = false;
  				if (data.success) {
  					$state.go('posts-trending');
  				} else {
  					vm.error = data.message;
          }
  			});


  	};

    vm.guestLogin = function() {
      vm.processing = true;
      vm.error = '';

      Auth.login("guest", "guest")
        .success(function(data) {
          vm.processing = false;
          if (data.success) {
            $state.go('posts-trending');
          } else {
            vm.error = data.message;
          }
        });
    }

  	vm.doLogout = function() {
      console.log("hello");

  		Auth.logout();
  		vm.user = '';

  		$state.go('login');
  	};
});

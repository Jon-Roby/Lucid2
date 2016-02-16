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

angular.module('authService', [])

.factory('Auth', function($http, $q, AuthToken) {

	var authFactory = {};

	authFactory.register = function(name, username, password) {
		return $http.post('api/register', {
			name: name,
			username: username,
			password: password
		})
		 	.success(function(data) {
				AuthToken.setToken(data.token);
				return data;
			});
	};

	authFactory.login = function(username, password) {

		return $http.post('/api/authenticate', {
			username: username,
			password: password
		})
			.success(function(data) {
				AuthToken.setToken(data.token);
        return data;
			});
	};

	authFactory.logout = function() {
		AuthToken.setToken();
	};

	authFactory.isLoggedIn = function() {
		if (AuthToken.getToken())
			return true;
		else
			return false;
	};

	authFactory.getUser = function() {
		if (AuthToken.getToken())
			return $http.get('/api/me', { cache: true });
		else
			return $q.reject({ message: 'User has no token.' });
	};

	return authFactory;

})

.factory('AuthToken', function($window) {

	var authTokenFactory = {};

	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};

	authTokenFactory.setToken = function(token) {
		if (token)
			$window.localStorage.setItem('token', token);
	 	else
			$window.localStorage.removeItem('token');
	};

	return authTokenFactory;

})

.factory('AuthInterceptor', function($q, $location, AuthToken) {

	var interceptorFactory = {};

	interceptorFactory.request = function(config) {

		var token = AuthToken.getToken();

		if (token)
			config.headers['x-access-token'] = token;

		return config;
	};

	interceptorFactory.responseError = function(response) {

		if (response.status == 403) {
			AuthToken.setToken();
			$location.path('/login');
		}

		return $q.reject(response);
	};

	return interceptorFactory;

});

// 
// // use this for tabs and mayb login/logout
// angular.module('sharedDetailsService', [])
//   .factory('sharedDetails', function() {
//
//     var viewer = {};
//     var author = {};
//     var post = {}
//
//     var sharedDetails = {
//       getViewer: function() {
//         return viewer;
//       },
//
//       getAuthor: function() {
//         return author;
//       },
//
//       getPost: function() {
//         return post;
//       },
//
//       setViewer: function(update) {
//         viewer = update;
//       },
//
//       setAuthor: function(update) {
//         author = update;
//       },
//
//       setPost: function(update) {
//         post = update;
//       }
//     };
//
//     return sharedDetails;
//
//   });


  // var postFactory = {};
  //
  // postFactory.get = function(id) {
  //   return $http.get('/api/posts/' + id);
  // };
  //
  // postFactory.getUserId = function(id) {
  //   return $http.get('/api/users/' + id);
  // };

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

angular.module('iconsService', [])

.factory('Icons', function($http) {

	// create a new object
	var iconsFactory = {};

	iconsFactory.getIcons = function() {
		return $http.get('api/users/icons');
	};

	return iconsFactory;

});



angular.module('postAuthorCtrl', ['postAuthorService'])

	.controller('postAuthorController', function(PostAuthor, Auth, $stateParams, $rootScope) {

		var vm = this;
		vm.processing = true;

		$rootScope.$on('alterAuthorUpvotes', function(event, alter) { vm.post.userData.upvotes = alter; });


		Auth.getUser()
			.then(function(data) {
				PostAuthor.getUserId(data.data._id)
					.success(function(data) {
						vm.userData = data;

						//Send data to sharedDetailsService
					});
			});
		// Grab the params of post
		PostAuthor.get($stateParams.post_id)
			.success(function(data) {
				vm.post = data;
				// grab the user of the params of post
				PostAuthor.getUserId(vm.post.authorId)
					.success(function(data) {
						vm.post.userData = data;

						//Send data to sharedDetails service
					});
			});

			vm.subscribeToAuthor = function() {

				PostAuthor.subscribeToAuthor(vm.userData, vm.post)
					.success(function(data) {
						Auth.getUser()
							.then(function(data) {
								PostAuthor.getUserId(data.data._id)
									.success(function(data) {
										$rootScope.$broadcast('updateSubscriptions', data.subscriptions);
										vm.userData = data;
									});
							});
					});
			};
	});

angular.module('postAuthorService', [])

.factory('PostAuthor', function($http) {

	// create a new object
	var postAuthorFactory = {};

	postAuthorFactory.get = function(id) {
		return $http.get('/api/posts/' + id);
	};

	postAuthorFactory.getUserId = function(id) {
		return $http.get('/api/users/' + id);
	};

  postAuthorFactory.subscribeToAuthor = function(userId, userData) {
    var action = $http.put('/api/users/' + userId._id + '/subscribe', userData);
		return action;
  };

	return postAuthorFactory;

});

angular.module('postDisplayCtrl', ['postDisplayService'])

	.controller('postDisplayController', function($stateParams, PostDisplay, Auth, $rootScope) {

		var vm = this;

		var arrayHasValue = function(array, value) {
			for (var i = 0; i < array.length; i++) {
				if (array[i].id === value) {
					return true;
				}
			}
			return false;
		}

		PostDisplay.get($stateParams.post_id)
			.success(function(data) {
				vm.postDetails = data;

				PostDisplay.getUserId(vm.postDetails.authorId)
					.success(function(authorObject) {
						vm.authorDetails = authorObject;
					});
			});



		// get the viewer (viewing user)
    Auth.getUser()
      .then(function(viewer) {

				// gets the viewer's data
				// This is necessary to determine like/upvote, favorite, and bookmark
				PostDisplay.getUserId(viewer.data._id)
          .success(function(viewerObject) {
            vm.viewerDetails = viewerObject;

						vm.upvotes_count = vm.postDetails.upvotes.length;
						vm.viewerUpvoted = vm.postDetails.upvotes.includes(vm.viewerDetails._id);

						var post_id = vm.postDetails._id;
						vm.viewerBookmarked = arrayHasValue(vm.viewerDetails.bookmarks, post_id);
						vm.viewerFavorited = arrayHasValue(vm.viewerDetails.favorites, post_id);
          });
      });

		// REWORK THIS NONSENSE
		vm.deletePost = function(id) {
			// vm.viewerDetails ....     vm.postDetails.authorId
			if (vm.userData._id === vm.post.authorId) {
				PostDisplay.delete(id)
					.success(function(data) {
						PostDisplay.all()
							.success(function(data) {
								vm.processing = false;
								// vm.posts????
								vm.posts = data;
							});
					});
			}
		};

		vm.upvotePost = function() {
			PostDisplay.upvotePost(vm.postDetails._id)
				.success(function(data) {
					// $rootScope.$broadcast('alterAuthorUpvotes', data.author.upvotes);
					vm.authorDetails.upvotes = data.author.upvotes;
					vm.postDetails = data.post;
					vm.upvotes_count = vm.postDetails.upvotes.length;
					console.log(vm.postDetails.upvotes.length);
					console.log(vm.upvotes_count);
					vm.viewerUpvoted = vm.postDetails.upvotes.includes(vm.viewerDetails._id);
				});
		};

		vm.favoritePost = function() {
			PostDisplay.favoritePost(vm.viewerDetails, vm.postDetails)
				.then(function(object) {

					$rootScope.$broadcast('updateFavorites', object.data.user.favorites);

					vm.viewerDetails = object.data.user;
					vm.viewerFavorited = arrayHasValue(vm.viewerDetails.favorites, vm.postDetails._id);
				})
		}

		vm.bookmark = function() {
			PostDisplay.bookmark(vm.viewerDetails._id, vm.postDetails)
				.success(function(viewerObject) {

					$rootScope.$broadcast('updateBookmarks', viewerObject.user.bookmarks);

					// Check if the viewer's bookmarks include the post_id
					// Set the result to vm.viewerBookmarked
					vm.viewerDetails = viewerObject.user;
					vm.viewerBookmarked = arrayHasValue(vm.viewerDetails.bookmarks, vm.postDetails._id);
				});
		};

		vm.subscribeToAuthor = function() {
			console.log("ches")
			var subscriptionDetails = {};
			subscriptionDetails.authorDetails = vm.authorDetails;
			subscriptionDetails.viewerDetails = vm.viewerDetails;
			PostDisplay.subscribeToAuthor(subscriptionDetails)
				.success(function(data) {
					console.log("casdf")
					$rootScope.$broadcast('updateSubscriptions', data.viewerObject.subscriptions);
					// vm.userData = data;
				});
		};

	});

angular.module('postDisplayService', [])

.factory('PostDisplay', function($http) {

	var postFactory = {};

	postFactory.get = function(id) {
		return $http.get('/api/posts/' + id);
	};

	postFactory.getUserId = function(id) {
		return $http.get('/api/users/' + id);
	};

	postFactory.upvotePost = function(id) {
		return $http.put('/api/posts/' + id + '/upvote');
	};

	postFactory.favoritePost = function(viewerObject, postObject) {
		return $http.put('/api/users/' + viewerObject._id + '/favorite', postObject);
	};

	postFactory.bookmark = function(userId, postData) {
		return $http.put('/api/users/' + userId + '/bookmark', postData);
	};

	postFactory.delete = function(id) {
		return $http.delete('/api/posts/post/' + id);
	};

	postFactory.subscribeToAuthor = function(subscriptionDetails) {
    return $http.put('/api/users/' + subscriptionDetails.authorDetails._id + '/subscribe', subscriptionDetails);
  };

	return postFactory;

});

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

angular.module('postCreateService', [])

.factory('PostCreate', function($http) {

	var postFactory = {};

	postFactory.get = function(id) {
		return $http.get('/api/posts/' + id);
	};

	postFactory.getUserId = function(id) {
		return $http.get('/api/users/' + id);
	};

	postFactory.create = function(postData) {
		return $http.post('/api/posts/', postData);
	};

	postFactory.update = function(id, postData) {
		return $http.put('/api/posts/' + id, postData);
	};

	// change to api/posts/post_id/delete
	postFactory.delete = function(id) {
		return $http.delete('/api/posts/' + id);
	};

	return postFactory;

});

angular.module('postsDisplayCtrl', ['postsDisplayService'])

	.controller('postsDisplayController', function(PostsDisplay, Auth, $location) {
		var vm = this;
		vm.processing = true;

		// Auth.getUser()
		// 	.then(function(data) {
		// 		PostsDisplay.getUserId(data.data._id)
		// 			.success(function(data) {
		// 				vm.userData = data;
		// 			});
		// 	});

		// vm.selected = "";
		//
		// vm.getSelected = function() {
		// 	vm.selected = PostsOptions.getSelected();
		// };
		// vm.setSelected = function(value) {
    //   PostsOptions.setSelected(value);
		// 	vm.selected = PostsOptions.getSelected(value);
    // };




		// case switch statement
		
		if ($location.path() === "/posts/trending") {
			PostsDisplay.getTrendingPosts()
				.success(function(data) {
					vm.processing = false;
					vm.posts = data;
				});
		} else if ($location.path() === "/posts/popular") {
			PostsDisplay.getPopularPosts()
				.success(function(data) {
					vm.processing = false;
					vm.posts = data;
				});
		} else if ($location.path() === "/posts/new") {
			PostsDisplay.getNewPosts()
				.success(function(data) {
					vm.processing = false;
					vm.posts = data;
				});
		} else {
			console.log("hello");
		}








	});

angular.module('postsDisplayService', [])

.factory('PostsDisplay', function($http) {

	var postFactory = {};

	postFactory.all = function() {
		return $http.get('/api/posts/');
	};

	postFactory.getTrendingPosts = function() {
		return $http.get('/api/posts/trending');
	};

	postFactory.getPopularPosts = function() {
		return $http.get('/api/posts/popular');
	};

	postFactory.getNewPosts = function() {
		return $http.get('/api/posts/new');
	};


	return postFactory;

});

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


	// vm.add = function(){
	
	// 	  var file = document.getElementById('file').files[0];
	// 	  var reader = new FileReader();
	// 	  console.log(file);
	// 	 	reader.readAsDataURL( file );
	// 	 	console.log(reader);
	// 	 	console.log(reader.result);
	// 	  // Cloudinary.upload(files, {}, function(err, res) {
 //    //   	console.log(res.url);
 //    // 	});

	// 	  // var form = new FormData();
	// 	  // form.append('file', file);
	// 	  // console.log(form);
		  
	// 	  // UserDisplay.uploadPhoto($stateParams.user_id, form)
		  	 
	// 	  // r.onloadend = function(e) {
	// 	  //   var data = e.target.result;
	// 	  //   console.log(data);
	// 			// var photo = {photo: data};
	// 			// UserDisplay.uploadPhoto($stateParams.user_id, photo)
		    
	// 	  // }
	// 	  // reader.readAsBinaryString(file);

	// 	}
	

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

		vm.add = function() {
	
		  var file = document.getElementById('file').files[0];
		  var reader = new FileReader();
		  	 
		  reader.onloadend = function(event) {
		    var data = event.target.result;

		    console.log(data);
		    console.log(reader);
				var photo = {photo: data};
				UserDisplay.uploadPhoto($stateParams.user_id, photo);
				
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



angular.module('userDisplayService', [])

.factory('UserDisplay', function($http) {

	// create a new object
	var userDisplayFactory = {};

	// get a single user
	userDisplayFactory.get = function(id) {
		return $http.get('/api/users/' + id);
	};

	// get all users
	userDisplayFactory.all = function() {
		return $http.get('/api/users/');
	};

	// create a user
	userDisplayFactory.create = function(userData) {
		return $http.post('/api/users/', userData);
	};

	// update a user
	userDisplayFactory.update = function(id, userData) {
		return $http.put('/api/users/' + id, userData);
	};

	// delete a user
	userDisplayFactory.delete = function(id) {
		return $http.delete('/api/users/' + id);
	};

	userDisplayFactory.uploadPhoto = function(id, photo) {
		
		return $http.post('/api/users/' + id + '/profile/', photo);
	};

	// return our entire userDisplayFactory object
	return userDisplayFactory;

});

angular.module('userSidebarCtrl', ['userSidebarService'])

	.controller('userSidebarController', function(UserSidebar, Auth, $rootScope) {

		var vm = this;
		vm.processing = true;

		$rootScope.$on('updateBookmarks', function(event, bookmarks) { vm.userData.bookmarks = bookmarks; });
		$rootScope.$on('updateFavorites', function(event, favorites) { vm.userData.favorites = favorites; });


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

angular.module('userSidebarService', [])

.factory('UserSidebar', function($http) {

	var menuFactory = {};

	menuFactory.getUserId = function(id) {
		return $http.get('/api/users/' + id);
	};

	return menuFactory;

});

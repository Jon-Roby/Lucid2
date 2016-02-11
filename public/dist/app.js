angular.module("myApp",["app.routes","ngAnimate","angularMoment","angularFileUpload","authService","mainCtrl","postsDisplayCtrl","postsDisplayService","iconsCtrl","iconsService","userSidebarCtrl","userSidebarService","postDisplayCtrl","postDisplayService","postAuthorCtrl","postAuthorService","postCreateCtrl","postCreateService","userDisplayCtrl","userDisplayService"]).config(["$httpProvider",function(e){e.interceptors.push("AuthInterceptor")}]),angular.module("app.routes",["ui.router"]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(e,t,s){t.otherwise("/"),e.state("login",{url:"/login",templateUrl:"app/views/pages/users/login.html",controller:"mainController",controllerAs:"login"}).state("signup",{url:"/signup",templateUrl:"app/views/pages/users/signup.html",controller:"mainController",controllerAs:"signup"}).state("users",{url:"/users",templateUrl:"app/views/pages/users/all.html",controller:"userController",controllerAs:"user"}).state("posts-trending",{url:"/posts/trending",views:{"":{templateUrl:"app/components/postsDisplay/postsDisplayLayout.html"},"postsDisplay@posts-trending":{templateUrl:"app/components/postsDisplay/postsDisplayView.html",controller:"postsDisplayController",controllerAs:"postsDisplay"},"icons@posts-trending":{templateUrl:"app/components/icons/iconsView.html",controller:"iconsController",controllerAs:"icons"},"menu@posts-trending":{templateUrl:"app/components/userSidebar/userSidebarView.html",controller:"userSidebarController",controllerAs:"menu"}}}).state("posts-popular",{url:"/posts/popular",views:{"":{templateUrl:"app/components/postsDisplay/postsDisplayLayout.html"},"postsDisplay@posts-popular":{templateUrl:"app/components/postsDisplay/postsDisplayView.html",controller:"postsDisplayController",controllerAs:"postsDisplay"},"icons@posts-popular":{templateUrl:"app/components/icons/iconsView.html",controller:"iconsController",controllerAs:"icons"},"menu@posts-popular":{templateUrl:"app/components/userSidebar/userSidebarView.html",controller:"userSidebarController",controllerAs:"menu"}}}).state("posts-new",{url:"/posts/new",views:{"":{templateUrl:"app/components/postsDisplay/postsDisplayLayout.html"},"postsDisplay@posts-new":{templateUrl:"app/components/postsDisplay/postsDisplayView.html",controller:"postsDisplayController",controllerAs:"postsDisplay"},"icons@posts-new":{templateUrl:"app/components/icons/iconsView.html",controller:"iconsController",controllerAs:"icons"},"menu@posts-new":{templateUrl:"app/components/userSidebar/userSidebarView.html",controller:"userSidebarController",controllerAs:"menu"}}}).state("postCreate",{url:"/posts/create",templateUrl:"app/components/postCreate/postCreateView.html",controller:"postCreateController",controllerAs:"post"}).state("post",{url:"/posts/:post_id",views:{"":{templateUrl:"app/components/postDisplay/postDisplayLayout.html"},"postDisplay@post":{templateUrl:"app/components/postDisplay/postDisplayView.html",controller:"postDisplayController",controllerAs:"postDisplay"},"postDetails@post":{templateUrl:"app/components/postDisplay/postDisplayDetails.html",controller:"postDisplayController",controllerAs:"postDisplay"},"menu@post":{templateUrl:"app/components/userSidebar/userSidebarView.html",controller:"userSidebarController",controllerAs:"menu"}}}).state("postEdit",{url:"/posts/:post_id/edit",templateUrl:"app/components/postCreate/postCreateView.html",controller:"postEditController",controllerAs:"post"}).state("profile",{url:"/users/:user_id",templateUrl:"app/components/userDisplay/userDisplayView.html",controller:"userDisplayController",controllerAs:"user"}),s.html5Mode(!0)}]),angular.module("authService",[]).factory("Auth",["$http","$q","AuthToken",function(e,t,s){var o={};return o.register=function(t,o,r){return e.post("api/register",{name:t,username:o,password:r}).success(function(e){return s.setToken(e.token),e})},o.login=function(t,o){return e.post("/api/authenticate",{username:t,password:o}).success(function(e){return s.setToken(e.token),e})},o.logout=function(){s.setToken()},o.isLoggedIn=function(){return s.getToken()?!0:!1},o.getUser=function(){return s.getToken()?e.get("/api/me",{cache:!0}):t.reject({message:"User has no token."})},o}]).factory("AuthToken",["$window",function(e){var t={};return t.getToken=function(){return e.localStorage.getItem("token")},t.setToken=function(t){t?e.localStorage.setItem("token",t):e.localStorage.removeItem("token")},t}]).factory("AuthInterceptor",["$q","$location","AuthToken",function(e,t,s){var o={};return o.request=function(e){var t=s.getToken();return t&&(e.headers["x-access-token"]=t),e},o.responseError=function(o){return 403==o.status&&(s.setToken(),t.path("/login")),e.reject(o)},o}]),angular.module("postService",[]).factory("Post",["$http",function(e){var t={};return t.all=function(){return e.get("/api/posts/")},t.get=function(t){return e.get("/api/posts/"+t)},t.getUserId=function(t){return e.get("/api/users/"+t)},t.upvotePost=function(t){return e.put("/api/posts/"+t+"/upvote")},t.bookmark=function(t,s){return e.put("/api/users/"+t+"/bookmark",s)},t.subscribeToAuthor=function(t,s){return e.put("/api/users/"+t._id+"/subscribe",s)},t.getIcons=function(){return e.get("api/users/icons")},t.create=function(t){return e.post("/api/posts/",t)},t.update=function(t,s){return e.put("/api/posts/post/"+t,s)},t["delete"]=function(t){return e["delete"]("/api/posts/post/"+t)},t}]),angular.module("userService",[]).factory("User",["$http",function(e){var t={};return t.get=function(t){return e.get("/api/users/"+t)},t.all=function(){return e.get("/api/users/")},t.create=function(t){return e.post("/api/users/",t)},t.update=function(t,s){return e.put("/api/users/"+t,s)},t["delete"]=function(t){return e["delete"]("/api/users/"+t)},t}]),angular.module("mainCtrl",[]).controller("mainController",["$rootScope","$location","Auth","$state",function(e,t,s,o){var r=this;switch(r.loggedIn=s.isLoggedIn(),e.$on("$stateChangeSuccess",function(){switch(r.loggedIn=s.isLoggedIn(),s.getUser().then(function(e){r.user=e.data}),t.path()){case"/posts/trending":r.showSliderMargin=!0;break;case"/posts/popular":r.showSliderMargin=!0;break;case"/posts/new":r.showSliderMargin=!0;break;default:r.showSliderMargin=!1}}),r.selected="",t.path()){case"/posts/trending":r.sliderMargin="navbar-options-left";break;case"/posts/popular":r.sliderMargin="navbar-options-middle";break;case"/posts/new":r.sliderMargin="navbar-options-right";break;default:r.sliderMargin="navbar-options-none"}r.switchPage=function(e){o.go(e)},r.signup=function(){r.processing=!0,r.error="",s.register(r.loginData.name,r.loginData.username,r.loginData.password).success(function(e){r.processing=!1,e.success?t.path("/posts"):r.error=e.message})},r.doLogin=function(){r.processing=!0,r.error="",s.logout(),s.login(r.loginData.username,r.loginData.password).success(function(e){r.processing=!1,e.success?o.go("posts-trending"):r.error=e.message})},r.guestLogin=function(){r.processing=!0,r.error="",s.login("guest","guest").success(function(e){r.processing=!1,e.success?o.go("posts-trending"):r.error=e.message})},r.doLogout=function(){console.log("hello"),s.logout(),r.user="",o.go("login")}}]),angular.module("userDisplayCtrl",["userService"]).controller("userDisplayController",["User",function(e){var t=this;t.processing=!0,e.all().success(function(e){t.processing=!1,t.users=e}),t.deleteUser=function(s){t.processing=!0,e["delete"](s).success(function(s){e.all().success(function(e){t.processing=!1,t.users=e})})}}]).controller("userCreateController",["User",function(e){var t=this;t.type="create",t.saveUser=function(){t.processing=!0,t.message="",e.create(t.userData).success(function(e){t.processing=!1,t.userData={},t.message=e.message})}}]).controller("userEditController",["$routeParams","User",function(e,t){var s=this;s.type="edit",t.get(e.user_id).success(function(e){s.userData=e}),s.saveUser=function(){s.processing=!0,s.message="",t.update(e.user_id,s.userData).success(function(e){s.processing=!1,s.userData={},s.message=e.message})}}]).controller("userProfileController",["$routeParams","User",function(e,t){var s=this;s.processing=!0,t.get(e.user_id).success(function(e){s.userData=e}),s.deleteUser=function(e){s.processing=!0,t["delete"](e).success(function(e){t.all().success(function(e){s.processing=!1,s.users=e})})}}]),angular.module("iconsCtrl",["iconsService"]).controller("iconsController",["Icons","Auth",function(e,t){var s=this;s.processing=!0,e.getIcons().success(function(e){s.icons=e}),s.showPopover=function(){s.popoverIsVisible=!0},s.hidePopover=function(){s.popoverIsVisible=!1}}]),angular.module("iconsService",[]).factory("Icons",["$http",function(e){var t={};return t.getIcons=function(){return e.get("api/users/icons")},t}]),angular.module("postAuthorCtrl",["postAuthorService"]).controller("postAuthorController",["PostAuthor","Auth","$stateParams","$rootScope",function(e,t,s,o){var r=this;r.processing=!0,o.$on("alterAuthorUpvotes",function(e,t){r.post.userData.upvotes=t}),t.getUser().then(function(t){e.getUserId(t.data._id).success(function(e){r.userData=e})}),e.get(s.post_id).success(function(t){r.post=t,e.getUserId(r.post.authorId).success(function(e){r.post.userData=e})}),r.subscribeToAuthor=function(){e.subscribeToAuthor(r.userData,r.post).success(function(s){t.getUser().then(function(t){e.getUserId(t.data._id).success(function(e){o.$broadcast("updateSubscriptions",e.subscriptions),r.userData=e})})})}}]),angular.module("postAuthorService",[]).factory("PostAuthor",["$http",function(e){var t={};return t.get=function(t){return e.get("/api/posts/"+t)},t.getUserId=function(t){return e.get("/api/users/"+t)},t.subscribeToAuthor=function(t,s){var o=e.put("/api/users/"+t._id+"/subscribe",s);return o},t}]),angular.module("postCreateCtrl",["postCreateService"]).controller("postCreateController",["PostCreate",function(e){var t=this;t.type="create",t.savePost=function(){t.processing=!0,t.message="",e.create(t.postData).success(function(e){t.processing=!1,t.postData={},t.message=e.message})}}]).controller("postEditController",["$stateParams","PostCreate",function(e,t){var s=this;s.type="edit",t.get(e.post_id).success(function(e){s.postData=e}),s.savePost=function(){s.processing=!0,s.message="",t.update(e.post_id,s.postData).success(function(e){s.processing=!1,s.postData={},s.message=e.message})}}]),angular.module("postCreateService",[]).factory("PostCreate",["$http",function(e){var t={};return t.get=function(t){return e.get("/api/posts/"+t)},t.getUserId=function(t){return e.get("/api/users/"+t)},t.create=function(t){return e.post("/api/posts/",t)},t.update=function(t,s){return e.put("/api/posts/"+t,s)},t["delete"]=function(t){return e["delete"]("/api/posts/"+t)},t}]),angular.module("postDisplayCtrl",["postDisplayService"]).controller("postDisplayController",["$stateParams","PostDisplay","Auth","$rootScope",function(e,t,s,o){var r=this,n=function(e,t){for(var s=0;s<e.length;s++)if(e[s].id===t)return!0;return!1};t.get(e.post_id).success(function(e){r.postDetails=e,t.getUserId(r.postDetails.authorId).success(function(e){r.authorDetails=e})}),s.getUser().then(function(e){t.getUserId(e.data._id).success(function(e){r.viewerDetails=e,r.upvotes_count=r.postDetails.upvotes.length,r.viewerUpvoted=r.postDetails.upvotes.includes(r.viewerDetails._id);var t=r.postDetails._id;r.viewerBookmarked=n(r.viewerDetails.bookmarks,t),r.viewerFavorited=n(r.viewerDetails.favorites,t)})}),r.deletePost=function(e){r.userData._id===r.post.authorId&&t["delete"](e).success(function(e){t.all().success(function(e){r.processing=!1,r.posts=e})})},r.upvotePost=function(){t.upvotePost(r.postDetails._id).success(function(e){r.authorDetails.upvotes=e.author.upvotes,r.postDetails=e.post,r.upvotes_count=r.postDetails.upvotes.length,console.log(r.postDetails.upvotes.length),console.log(r.upvotes_count),r.viewerUpvoted=r.postDetails.upvotes.includes(r.viewerDetails._id)})},r.favoritePost=function(){t.favoritePost(r.viewerDetails,r.postDetails).then(function(e){o.$broadcast("updateFavorites",e.data.user.favorites),r.viewerDetails=e.data.user,r.viewerFavorited=n(r.viewerDetails.favorites,r.postDetails._id)})},r.bookmark=function(){t.bookmark(r.viewerDetails._id,r.postDetails).success(function(e){o.$broadcast("updateBookmarks",e.user.bookmarks),r.viewerDetails=e.user,r.viewerBookmarked=n(r.viewerDetails.bookmarks,r.postDetails._id)})},r.subscribeToAuthor=function(){console.log("ches");var e={};e.authorDetails=r.authorDetails,e.viewerDetails=r.viewerDetails,t.subscribeToAuthor(e).success(function(e){console.log("casdf"),o.$broadcast("updateSubscriptions",e.viewerObject.subscriptions)})}}]),angular.module("postDisplayService",[]).factory("PostDisplay",["$http",function(e){var t={};return t.get=function(t){return e.get("/api/posts/"+t)},t.getUserId=function(t){return e.get("/api/users/"+t)},t.upvotePost=function(t){return e.put("/api/posts/"+t+"/upvote")},t.favoritePost=function(t,s){return e.put("/api/users/"+t._id+"/favorite",s)},t.bookmark=function(t,s){return e.put("/api/users/"+t+"/bookmark",s)},t["delete"]=function(t){return e["delete"]("/api/posts/post/"+t)},t.subscribeToAuthor=function(t){return e.put("/api/users/"+t.authorDetails._id+"/subscribe",t)},t}]),angular.module("postsDisplayCtrl",["postsDisplayService"]).controller("postsDisplayController",["PostsDisplay","Auth","$location",function(e,t,s){var o=this;o.processing=!0,"/posts/trending"===s.path()?e.getTrendingPosts().success(function(e){o.processing=!1,o.posts=e}):"/posts/popular"===s.path()?e.getPopularPosts().success(function(e){o.processing=!1,o.posts=e}):"/posts/new"===s.path()?e.getNewPosts().success(function(e){o.processing=!1,o.posts=e}):console.log("hello")}]),angular.module("postsDisplayService",[]).factory("PostsDisplay",["$http",function(e){var t={};return t.all=function(){return e.get("/api/posts/")},t.getTrendingPosts=function(){return e.get("/api/posts/trending")},t.getPopularPosts=function(){return e.get("/api/posts/popular")},t.getNewPosts=function(){return e.get("/api/posts/new")},t}]),angular.module("userDisplayCtrl",["userDisplayService"]).controller("userDisplayController",["UserDisplay","$stateParams","FileUploader",function(e,t,s){var o=this;o.processing=!0,e.get(t.user_id).success(function(e){o.userData=e}),o.uploader=new s,o.upload=function(){console.log(o.uploader.queue[0].formData),console.log(o.uploader.queue[0].file),e.uploadPhoto(t.user_id,o.uploader.queue[0].file)},o.uploadPhoto=function(){console.log(o.uploadedPhoto)},o.processForm=function(){var e=new FileReader;e.onload=function(e){this.result},e.readAsDataURL(file)},o.add=function(){var s=document.getElementById("file").files[0],o=new FileReader;o.onloadend=function(s){var r=s.target.result;console.log(r),console.log(o);var n={photo:r};e.uploadPhoto(t.user_id,n)},o.readAsDataURL(s)}}]),angular.module("userDisplayService",[]).factory("UserDisplay",["$http",function(e){var t={};return t.get=function(t){return e.get("/api/users/"+t)},t.all=function(){return e.get("/api/users/")},t.create=function(t){return e.post("/api/users/",t)},t.update=function(t,s){return e.put("/api/users/"+t,s)},t["delete"]=function(t){return e["delete"]("/api/users/"+t)},t.uploadPhoto=function(t,s){return e.post("/api/users/"+t+"/profile/",s)},t}]),angular.module("userSidebarCtrl",["userSidebarService"]).controller("userSidebarController",["UserSidebar","Auth","$rootScope",function(e,t,s){var o=this;o.processing=!0,s.$on("updateBookmarks",function(e,t){o.userData.bookmarks=t}),s.$on("updateFavorites",function(e,t){o.userData.favorites=t}),s.$on("updateSubscriptions",function(e,t){o.userData.subscriptions=t}),t.getUser().then(function(t){e.getUserId(t.data._id).success(function(e){o.userData=e})})}]),angular.module("userSidebarService",[]).factory("UserSidebar",["$http",function(e){var t={};return t.getUserId=function(t){return e.get("/api/users/"+t)},t}]);
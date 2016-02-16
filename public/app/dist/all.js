angular.module("mainCtrl",[]).controller("mainController",["$rootScope","$location","Auth","$state",function(t,e,s,o){var r=this;switch(r.loggedIn=s.isLoggedIn(),t.$on("$stateChangeSuccess",function(){switch(r.loggedIn=s.isLoggedIn(),s.getUser().then(function(t){r.user=t.data}),e.path()){case"/posts/trending":r.showSliderMargin=!0;break;case"/posts/popular":r.showSliderMargin=!0;break;case"/posts/new":r.showSliderMargin=!0;break;default:r.showSliderMargin=!1}}),r.selected="",e.path()){case"/posts/trending":r.sliderMargin="navbar-options-left";break;case"/posts/popular":r.sliderMargin="navbar-options-middle";break;case"/posts/new":r.sliderMargin="navbar-options-right";break;default:r.sliderMargin="navbar-options-none"}r.switchPage=function(t){o.go(t)},r.signup=function(){r.processing=!0,r.error="",s.register(r.loginData.name,r.loginData.username,r.loginData.password).success(function(t){r.processing=!1,t.success?e.path("/posts"):r.error=t.message})},r.doLogin=function(){r.processing=!0,r.error="",s.logout(),s.login(r.loginData.username,r.loginData.password).success(function(t){r.processing=!1,t.success?o.go("posts-trending"):r.error=t.message})},r.guestLogin=function(){r.processing=!0,r.error="",s.login("guest","guest").success(function(t){r.processing=!1,t.success?o.go("posts-trending"):r.error=t.message})},r.doLogout=function(){s.logout(),r.user="",o.go("login")}}]),angular.module("authService",[]).factory("Auth",["$http","$q","AuthToken",function(t,e,s){var o={};return o.register=function(e,o,r){return t.post("api/register",{name:e,username:o,password:r}).success(function(t){return s.setToken(t.token),t})},o.login=function(e,o){return t.post("/api/authenticate",{username:e,password:o}).success(function(t){return s.setToken(t.token),t})},o.logout=function(){s.setToken()},o.isLoggedIn=function(){return s.getToken()?!0:!1},o.getUser=function(){return s.getToken()?t.get("/api/me",{cache:!0}):e.reject({message:"User has no token."})},o}]).factory("AuthToken",["$window",function(t){var e={};return e.getToken=function(){return t.localStorage.getItem("token")},e.setToken=function(e){e?t.localStorage.setItem("token",e):t.localStorage.removeItem("token")},e}]).factory("AuthInterceptor",["$q","$location","AuthToken",function(t,e,s){var o={};return o.request=function(t){var e=s.getToken();return e&&(t.headers["x-access-token"]=e),t},o.responseError=function(o){return 403==o.status&&(s.setToken(),e.path("/login")),t.reject(o)},o}]),angular.module("iconsCtrl",["iconsService"]).controller("iconsController",["Icons","Auth",function(t,e){var s=this;s.processing=!0,t.getIcons().success(function(t){s.icons=t}),s.showPopover=function(){s.popoverIsVisible=!0},s.hidePopover=function(){s.popoverIsVisible=!1}}]),angular.module("iconsService",[]).factory("Icons",["$http",function(t){var e={};return e.getIcons=function(){return t.get("api/users/icons")},e}]),angular.module("postAuthorCtrl",["postAuthorService"]).controller("postAuthorController",["PostAuthor","Auth","$stateParams","$rootScope",function(t,e,s,o){var r=this;r.processing=!0,o.$on("alterAuthorUpvotes",function(t,e){r.post.userData.upvotes=e}),e.getUser().then(function(e){t.getUserId(e.data._id).success(function(t){r.userData=t})}),t.get(s.post_id).success(function(e){r.post=e,t.getUserId(r.post.authorId).success(function(t){r.post.userData=t})}),r.subscribeToAuthor=function(){t.subscribeToAuthor(r.userData,r.post).success(function(s){e.getUser().then(function(e){t.getUserId(e.data._id).success(function(t){o.$broadcast("updateSubscriptions",t.subscriptions),r.userData=t})})})}}]),angular.module("postAuthorService",[]).factory("PostAuthor",["$http",function(t){var e={};return e.get=function(e){return t.get("/api/posts/"+e)},e.getUserId=function(e){return t.get("/api/users/"+e)},e.subscribeToAuthor=function(e,s){var o=t.put("/api/users/"+e._id+"/subscribe",s);return o},e}]),angular.module("postDisplayCtrl",["postDisplayService"]).controller("postDisplayController",["$stateParams","PostDisplay","Auth","$rootScope",function(t,e,s,o){var r=this,n=function(t,e){for(var s=0;s<t.length;s++)if(t[s].id===e)return!0;return!1};e.get(t.post_id).success(function(t){r.postDetails=t,e.getUserId(r.postDetails.authorId).success(function(t){r.authorDetails=t})}),s.getUser().then(function(t){e.getUserId(t.data._id).success(function(t){r.viewerDetails=t,r.upvotes_count=r.postDetails.upvotes.length,r.viewerUpvoted=r.postDetails.upvotes.includes(r.viewerDetails._id);var e=r.postDetails._id;r.viewerBookmarked=n(r.viewerDetails.bookmarks,e),r.viewerFavorited=n(r.viewerDetails.favorites,e)})}),r.deletePost=function(t){r.userData._id===r.post.authorId&&e["delete"](t).success(function(t){e.all().success(function(t){r.processing=!1,r.posts=t})})},r.upvotePost=function(){e.upvotePost(r.postDetails._id).success(function(t){r.authorDetails.upvotes=t.author.upvotes,r.postDetails=t.post,r.upvotes_count=r.postDetails.upvotes.length,console.log(r.postDetails.upvotes.length),console.log(r.upvotes_count),r.viewerUpvoted=r.postDetails.upvotes.includes(r.viewerDetails._id)})},r.favoritePost=function(){e.favoritePost(r.viewerDetails,r.postDetails).then(function(t){o.$broadcast("updateFavorites",t.data.user.favorites),r.viewerDetails=t.data.user,r.viewerFavorited=n(r.viewerDetails.favorites,r.postDetails._id)})},r.bookmark=function(){e.bookmark(r.viewerDetails._id,r.postDetails).success(function(t){o.$broadcast("updateBookmarks",t.user.bookmarks),r.viewerDetails=t.user,r.viewerBookmarked=n(r.viewerDetails.bookmarks,r.postDetails._id)})},r.subscribeToAuthor=function(){var t={};t.authorDetails=r.authorDetails,t.viewerDetails=r.viewerDetails,e.subscribeToAuthor(t).success(function(t){o.$broadcast("updateSubscriptions",t.viewerObject.subscriptions)})}}]),angular.module("postDisplayService",[]).factory("PostDisplay",["$http",function(t){var e={};return e.get=function(e){return t.get("/api/posts/"+e)},e.getUserId=function(e){return t.get("/api/users/"+e)},e.upvotePost=function(e){return t.put("/api/posts/"+e+"/upvote")},e.favoritePost=function(e,s){return t.put("/api/users/"+e._id+"/favorite",s)},e.bookmark=function(e,s){return t.put("/api/users/"+e+"/bookmark",s)},e["delete"]=function(e){return t["delete"]("/api/posts/post/"+e)},e.subscribeToAuthor=function(e){return t.put("/api/users/"+e.authorDetails._id+"/subscribe",e)},e}]),angular.module("postCreateCtrl",["postCreateService"]).controller("postCreateController",["PostCreate",function(t){var e=this;e.type="create",e.savePost=function(){e.processing=!0,e.message="",t.create(e.postData).success(function(t){e.processing=!1,e.postData={},e.message=t.message})}}]).controller("postEditController",["$stateParams","PostCreate",function(t,e){var s=this;s.type="edit",e.get(t.post_id).success(function(t){s.postData=t}),s.savePost=function(){s.processing=!0,s.message="",e.update(t.post_id,s.postData).success(function(t){s.processing=!1,s.postData={},s.message=t.message})}}]),angular.module("postCreateService",[]).factory("PostCreate",["$http",function(t){var e={};return e.get=function(e){return t.get("/api/posts/"+e)},e.getUserId=function(e){return t.get("/api/users/"+e)},e.create=function(e){return t.post("/api/posts/",e)},e.update=function(e,s){return t.put("/api/posts/"+e,s)},e["delete"]=function(e){return t["delete"]("/api/posts/"+e)},e}]),angular.module("postsDisplayCtrl",["postsDisplayService"]).controller("postsDisplayController",["PostsDisplay","Auth","$location",function(t,e,s){var o=this;o.processing=!0,"/posts/trending"===s.path()?t.getTrendingPosts().success(function(t){o.processing=!1,o.posts=t}):"/posts/popular"===s.path()?t.getPopularPosts().success(function(t){o.processing=!1,o.posts=t}):"/posts/new"===s.path()?t.getNewPosts().success(function(t){o.processing=!1,o.posts=t}):console.log("hello")}]),angular.module("postsDisplayService",[]).factory("PostsDisplay",["$http",function(t){var e={};return e.all=function(){return t.get("/api/posts/")},e.getTrendingPosts=function(){return t.get("/api/posts/trending")},e.getPopularPosts=function(){return t.get("/api/posts/popular")},e.getNewPosts=function(){return t.get("/api/posts/new")},e}]),angular.module("userDisplayCtrl",["userDisplayService"]).controller("userDisplayController",["UserDisplay","$stateParams",function(t,e){var s=this;s.processing=!0,t.get(e.user_id).success(function(t){s.userData=t}),s.add=function(){var s=document.getElementById("file").files[0],o=new FileReader;o.onloadend=function(s){var o=s.target.result,r={photo:o};t.uploadPhoto(e.user_id,r)},o.readAsDataURL(s)}}]),angular.module("userDisplayService",[]).factory("UserDisplay",["$http",function(t){var e={};return e.get=function(e){return t.get("/api/users/"+e)},e.all=function(){return t.get("/api/users/")},e.create=function(e){return t.post("/api/users/",e)},e.update=function(e,s){return t.put("/api/users/"+e,s)},e["delete"]=function(e){return t["delete"]("/api/users/"+e)},e.uploadPhoto=function(e,s){return t.post("/api/users/"+e+"/profile/",s)},e}]),angular.module("userSidebarCtrl",["userSidebarService"]).controller("userSidebarController",["UserSidebar","Auth","$rootScope",function(t,e,s){var o=this;o.processing=!0,s.$on("updateBookmarks",function(t,e){o.userData.bookmarks=e}),s.$on("updateFavorites",function(t,e){o.userData.favorites=e}),s.$on("updateSubscriptions",function(t,e){o.userData.subscriptions=e}),e.getUser().then(function(e){t.getUserId(e.data._id).success(function(t){o.userData=t})})}]),angular.module("userSidebarService",[]).factory("UserSidebar",["$http",function(t){var e={};return e.getUserId=function(e){return t.get("/api/users/"+e)},e}]);
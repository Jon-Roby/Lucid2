angular.module('sharedDetailsService', [])
  .factory('sharedDetails', function($rootScope) {
    var sharedDetails = {};

    sharedDetails.subscription = {};

    sharedDetails.prepForBroadcast = function(information) {
      this.subscription = information;
      this.broadcastItem();
    };

    sharedDetails.broadcastItem = function() {
      $rootScope.$broadcast('handleBroadcast');
    };

    return sharedDetails;
  });


// angular.module('postsOptionsService', [])
//   .service('PostsOptions', function () {
//
//
//
//     var postOptionsFactory = {};
//
//     postOptionsFactory.trending = "trending";
//     postOptionsFactory.recent = "recent";
//     postOptionsFactory.popular = "popular";
//
//     postOptionsFactory.selected = "trending";
//
//     postOptionsFactory.getSelected = function () {
//       return postOptionsFactory.selected;
//       // return "Hello there";
//     },
//     postOptionsFactory.setSelected = function(value) {
//       console.log("I made it here and received " + value);
//       postOptionsFactory.selected = value;
//       console.log(postOptionsFactory.selected);
//     };
//
//     return postOptionsFactory;
//
//   });

var bodyParser  = require('body-parser');
var User        = require('../models/user');
var Post        = require('../models/post');
var jwt         = require('jsonwebtoken');

if (process.env.NODE_ENV == undefined) {
	var config      = require('../../config/auth.js');
	var secret      = config.secret;
} else {
	var secret = process.env.SECRET;
}

module.exports = function(app, express) {

	var apiRouter = express.Router();

	apiRouter.post('/authenticate', function(req, res) {

	  User.findOne({
	    username: req.body.username
	  }).select('name username password').exec(function(err, user) {

	    if (err) throw err;

	    if (!user) {
	      res.json({
	      	success: false,
	      	message: 'Authentication failed. User not found.'
	    	});
	    } else if (user) {

	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({
	        	success: false,
	        	message: 'Authentication failed. Wrong password.'
	      	});

	      } else {

	        var token = jwt.sign({
	        	name: user.name,
	        	username: user.username,
						_id: user._id
	        }, secret, {
	          expiresInMinutes: 1440
	        });

	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }

	    }

	  });
	});

	apiRouter.post('/register', function(req, res) {

		var user = new User();
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		user.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000)
					return res.json({ success: false, message: 'A user with that username already exists. '});
				else
					return res.send(err);
			}

			var token = jwt.sign({
				name: user.name,
				username: user.username,
				_id: user._id
			}, secret, {
				expiresInMinutes: 1440
			});

			res.json({
				success: true,
				message: 'Enjoy your token!',
				token: token
			});

		});
	});


	apiRouter.use(function(req, res, next) {
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  if (token) {

	    jwt.verify(token, secret, function(err, decoded) {

	      if (err) {
	        res.status(403).send({
	        	success: false,
	        	message: 'Failed to authenticate token.'
	    		});
	      } else {
	        req.decoded = decoded;
	        next();
	      }
	    });
	  } else {
      res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
	  }
	});






















	apiRouter.route('/users')

		.post(function(req, res) {
			var user = new User();
			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;

			user.save(function(err) {
				if (err) {
					if (err.code == 11000)
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else
						return res.send(err);
				}
				res.json({ message: 'User created!' });
			});
		})

		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);
				res.json(users);
			});
		});

	apiRouter.route('/users/icons')
		.get(function(req, res) {
			User.find().sort({upvotes_count: -1}).limit(5).exec(
				function(err, users) {
					if (err) res.send(err);
					res.json(users);
				}
			);
		});

	apiRouter.route('/users/:user_id')
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				// if (err) res.send(err);
				res.json(user);
			});
		})

		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				user.save(function(err) {
					if (err) res.send(err);
					res.json({ message: 'User updated!' });
				});
			});
		})

		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);
				res.json({ message: 'Successfully deleted' });
			});
		});

	apiRouter.route('/users/:user_id/bookmark')
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				var bookmarkObject = {};
				bookmarkObject[req.body._id] = req.body.title;
				var addBookmark = true;
				var index = 0;
				for (var i = 0; i < user.bookmarks.length; i++) {
					for (var key in user.bookmarks[i]) {
						if (key === req.body._id) {
							addBookmark = false;
							index = i;
						}
					}
				}

				if (addBookmark === true) {
					user.bookmarks.push(bookmarkObject);
				} else if (user.bookmarks.length === 1) {
					user.bookmarks = [];
				} else if (user.bookmarks[user.bookmarks.length-1] === index) {
					user.bookmarks[index].pop();
			  } else {
					// use .splice(index, 1)
					var left = user.bookmarks.slice(0, index);
					var right = user.bookmarks.slice(index+1, user.bookmarks.length);
					user.bookmarks = left.concat(right);
				}

				user.save(function(err) {
					res.json({ message: "Hello yo" });
				});

			});
		});

	apiRouter.route('/users/:user_id/subscribe')
		.put(function(req, res) {
			var subscribeeId = req.body.authorId;
			var subscribeeName = req.body.authorName;
			var subscribee = {};
			subscribee[subscribeeId] = subscribeeName;

			if (req.body.authorId !== req.params.user_id) {

				User.findById(req.params.user_id, function(err, user) {

					var subscriberId = user._id.toString();
					var subscriberName = user.name;

					var subscriber = {};
					subscriber[subscriberId] = subscriberName;

					var addSubscription = true;
					var index = -1;

					for (var i = 0; i < user.subscriptions.length; i++) {
						for (var key in user.subscriptions[i]) {

							if (key === subscribeeId) {
								addSubscription = false;
								index = i;
							}
						}
					}

					if (addSubscription) {
						user.subscriptions.push(subscribee);
					} else {
						var counter = -1;
						var filter = user.subscriptions.filter(function(q) {
							counter += 1;
							return index !== counter;
						});
						user.subscriptions = filter;
					}

					user.save(function(err) {
					});

					User.findById(subscribeeId, function(err, user2) {

						if (addSubscription) {
							user2.subscribers.push(subscriber);
						} else {
							var filter = user2.subscribers.filter(function(j) {
								for (var key in j) {
									return key !== subscriberId;
								}
							});
							user2.subscribers = filter;
						}
						user2.save(function(err) {
						});
					});
				});
			}
			res.json({ message: "hello from subscribe"});
		});


	apiRouter.route('/users/:user_id/profile')
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				res.json(user);
			});
		});






























	apiRouter.route('/posts')

		.get(function(req, res) {
			Post.find({}, function(err, posts) {
				if (err) res.send(err);
				res.json(posts);
			});
		})

		.post(function(req, res) {

			var post = new Post();
			post.title = req.body.title;
			post.body = req.body.body;

			post.authorId = req.decoded._id;
			post.authorName = req.decoded.username;

			authorId = req.decoded._id;

			post.save(function(err, post) {
				if (err) {
					if (err.code == 11000)
						return res.json({ success: false, message: 'A post with that postname already exists. '});
					else
						return res.send(err);
				}

				User.findById(authorId, function(err, user) {
					var object = {};
					object[post.title] = post._id;
					user.posts.push(object);
					// if (err) res.send(err);
					user.save(function(err) {

					});
				});
				res.json({ message: 'Post created!' });
			});

	});



	apiRouter.route('/posts/trending')

		.get(function(req, res) {
			// Post.find().sort({_id:1}).limit(4)
			// Post.find({}).sort({_id: -1}).exec(function(err, posts) {
			// 	if (err) res.send(err);
			//   res.json(posts);
			// });

			Post.find()
				.sort({_id: -1})
				// .select({upvotes: -1})
				.limit(3)
				.sort({upvotes_count: -1})
				.exec( function(err, posts) {
					if (err) res.send(err);
					console.log(posts);
					// var items = posts.slice(0,3);
					// console.log(items);
					// res.json(items);
					res.json(posts);
				});
		});

	apiRouter.route('/posts/popular')

		.get(function(req, res) {
			// Post.find().sort({_id:1}).limit(4)
			Post.find({}).sort({upvotes_count: -1}).exec(function(err, posts) {
				if (err) res.send(err);
			  res.json(posts);
			});
		});

	apiRouter.route('/posts/new')

		.get(function(req, res) {
			// Post.find().sort({_id:1}).limit(4)
			Post.find({}).sort({_id: -1}).exec(function(err, posts) {
				if (err) res.send(err);
			  res.json(posts);
			});
		});

	apiRouter.route('/posts/:post_id')
		.get(function(req, res) {
			Post.findById(req.params.post_id, function(err, post) {
				if (err) res.send(err);
				res.json(post);
			});
		});




	// apiRouter.route('/posts/:post_id')
	// 	// get the user with that id
	// 	.get(function(req, res) {
	// 		Post.findById(req.params.post_id, function(err, post) {
	// 			if (err) res.send(err);
	// 			// return that user
	// 			res.json(post);
	// 		});
	// 	})
	//
	// 	// update the post with this id
	// 	.put(function(req, res) {
	// 		Post.findById(req.params.post_id, function(err, post) {
	// 			if (err) res.send(err);
	// 			// set the new post information if it exists in the request
	// 			if (req.body.title) post.title = req.body.title;
	// 			if (req.body.body) post.body = req.body.body;
	//
	// 			post.save(function(err) {
	// 				if (err) res.send(err);
	// 				res.json({ message: 'Post updated!' });
	// 			});
	// 		});
	// 	})
	//
	// 	.delete(function(req, res) {
	//
	// 		// use request object to grab id ... if id is identical to author id on Post then it is allowed
	// 		Post.remove({
	// 			_id: req.params.post_id
	// 		}, function(err, post) {
	// 			if (err) res.send(err);
	//
	// 			res.json({ message: 'Successfully deleted' });
	// 		});
	// 	});






	// apiRouter.route('/posts/trending')
	// 	// get the user with that id
	// 	.get(function(req, res) {
	// 		Post.findById(req.params.post_id, function(err, post) {
	// 			if (err) res.send(err);
	// 			// return that user
	// 			res.json(post);
	// 		});
	//
	// 		Post.find().sort({_id:1}).limit(4)
	// 	});
	//
	// apiRouter.route('/posts/popular')
	// 	// get the user with that id
	// 	.get(function(req, res) {
	// 		Post.findById(req.params.post_id, function(err, post) {
	// 			if (err) res.send(err);
	// 			// return that user
	// 			res.json(post);
	// 		});
	// 	});
	//




	apiRouter.route('/posts/:post_id/upvote')
		.put(function(req, res) {
			Post.findById(req.params.post_id, function(err, post) {
				var action = '';
				var index = post.upvotes.indexOf(req.decoded._id);
				if (index === -1) {
					post.upvotes.push(req.decoded._id);
					post.upvotes_count += 1;

					User.findById(post.authorId, function(err, user) {
						// user.upvotes_count += 1;                                          ******* ADD UPVOTES PROPERTY FOR USERS*** TO FIND POPULAR USERS
						user.save(function(err) {
						});
					});

					// case where there is only one item in array, which messes up slice
				} else if (post.upvotes.length === 1 && post.upvotes[0] === req.decoded._id) {
					post.upvotes = [];
					post.upvotes_count = 0;

					User.findById(post.authorId, function(err, user) {
						// user.upvotes_count -= 1;                                         ******* ADD UPVOTES PROPERTY FOR USERS*** TO FIND POPULAR USERS
						user.save(function(err) {
						});
					});

				} else {
					var left = post.upvotes.slice(0, index);
					var right = post.upvotes.slice(index+1, post.upvotes.length);
					post.upvotes = left + right;
					post.upvotes_count -= 1;

					User.findById(post.authorId, function(err, user) {
						// user.upvotes_count -= 1;                                         ******* ADD UPVOTES PROPERTY FOR USERS*** TO FIND POPULAR USERS
						user.save(function(err) {
						});
					});

				};

				post.save(function(err) {
					if (err) res.send(err);
				});

				res.json({ message: action });

			});
		});

	apiRouter.get('/me', function(req, res) {

		res.send(req.decoded);
	});

  return apiRouter;
};

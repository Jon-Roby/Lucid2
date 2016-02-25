var bodyParser  = require('body-parser');
var User        = require('../models/user');
var Post        = require('../models/post');
var jwt         = require('jsonwebtoken');
var cloudinary  = require('cloudinary');

if (process.env.NODE_ENV == undefined) {
	var config      = require('../../config/auth.js');
	var secret      = config.secret;
} else {
	var secret = process.env.SECRET;
}

var arrayHasValue = function(array, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].id === value) {
			return i;
		}
	}
	return false;
};

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
			})


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

	apiRouter.route('/users/:user_id/profile')
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				res.json(user);
			});
		})
		.post(function(req, res) {

			User.findById(req.params.user_id)
				.then(function(user) {
					cloudinary.config({
					  cloud_name: process.env.CLOUD_NAME,
					  api_key: process.env.API_KEY,
					  api_secret: process.env.API_SECRET
					});

					cloudinary.uploader.upload(req.body.photo)
						.then(function(res) {
							user.photo = res.secure_url;
    					user.save(function(err) {
								if (err) res.send(err);
							});
						})
				});

		});





	// abstract this checking of the bookmark into another function
	apiRouter.route('/users/:user_id/bookmark')
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				var bookmarkObject = {};
				bookmarkObject.id = req.body._id;
				bookmarkObject.title = req.body.title;

				var result = arrayHasValue(user.bookmarks, bookmarkObject.id);

				if (result === false) {
					user.bookmarks.push(bookmarkObject);
				} else {
					user.bookmarks.splice(result, 1);
				}

				user.save(function(err) {
					if (err) throw err;
				});

				res.json({ message: "Bookmarked success", "user": user });
			});
		});

	apiRouter.route('/users/:user_id/favorite')
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				var favoriteObject = {};
				favoriteObject.id = req.body._id;
				favoriteObject.title = req.body.title;

				var result = arrayHasValue(user.favorites, favoriteObject.id)

				if (result === false) {
					user.favorites.push(favoriteObject);
				} else {
					user.favorites.splice(result, 1);
				}

				user.save(function(err) {
					if (err) throw err;
				});

				res.json({"user": user });
			});
		});

		apiRouter.route('/posts/:post_id/upvote')
			.put(function(req, res) {
				Post.findById(req.params.post_id)
					.then(function(post) {
						var userObject = {};
						User.findById(post.authorId)
							.then(function(user) {
								var index = post.upvotes.indexOf(req.decoded._id);
								if (index === -1) {
									post.upvotes.push(req.decoded._id);
									user.upvotes += 1;
								} else {
									post.upvotes.splice(index, 1);
									user.upvotes -= 1;
								}
								user.save(function(err) {
									if (err) res.send(err);
								})
								var userObject = user;

								post.save(function(err) {
									if (err) res.send(err);
								});

								res.json({ "post": post, "author": userObject });
							});
					});
			});

	apiRouter.route('/users/:user_id/subscribe')
		.put(function(req, res) {

			var subscribee = {};
			subscribee.id = req.body.authorDetails._id;
			subscribee.name = req.body.authorDetails.username;

			var subscriber = {};
			subscriber.id = req.body.viewerDetails._id;
			subscriber.name = req.body.viewerDetails.username;

			if (subscribee.id !== subscriber.id) {
				User.findById(subscribee.id)
					.then(function(user) {
						var result = arrayHasValue(user.subscribers, subscriber.id);
						if (result === false) {
							user.subscribers.push(subscriber)
						} else {
							user.subscribers.splice(result, 1);
						}
						user.save(function(err) {
							if (err) res.send(err);
						});

						User.findById(subscriber.id)
							.then(function(user2) {
								var result = arrayHasValue(user2.subscriptions, subscribee.id);
								if (result === false) {
									user2.subscriptions.push(subscribee)
								} else {
									user2.subscriptions.splice(result, 1)
								}
								user2.save(function(err) {
									if (err) res.send(err);
								});
								res.json({authorObject: user, viewerObject: user2});
							})
					})
			}
		});

	apiRouter.route('/posts')

		.get(function(req, res) {
			Post.find({}, function(err, posts) {
				if (err) res.send(err);
				res.json(posts);
			});
		})

		.post(function(req, res) {

			User.findById(req.decoded._id, function(err, user) {
				var post = new Post();
				post.title = req.body.title;
				post.body = req.body.body;

				post.authorId = req.decoded._id;
				post.authorName = req.decoded.username;

				post.authorImage = user.photo;

				authorId = req.decoded._id;

				post.save(function(err, post) {
					if (err) {
						if (err.code == 11000)
							return res.json({ success: false, message: 'A post with that postname already exists. '});
						else
							return res.send(err);
					}
				});


				var object = {};
				object[post.title] = post._id;
				user.posts.push(object);
				// if (err) res.send(err);
				user.save(function(err) {

				});


				res.json({ message: 'Post created!' });
			});
		});



			// })

			// var post = new Post();
			// post.title = req.body.title;
			// post.body = req.body.body;

			// post.authorId = req.decoded._id;
			// post.authorName = req.decoded.username;

			// post.authorImage = req.decoded.photo;
			// console.log(post.authorImage);
			// console.log(req.decoded);
			// console.log(post);

			// authorId = req.decoded._id;

			// post.save(function(err, post) {
			// 	if (err) {
			// 		if (err.code == 11000)
			// 			return res.json({ success: false, message: 'A post with that postname already exists. '});
			// 		else
			// 			return res.send(err);
			// 	}

			// 	User.findById(authorId, function(err, user) {
			// 		var object = {};
			// 		object[post.title] = post._id;
			// 		user.posts.push(object);
			// 		// if (err) res.send(err);
			// 		user.save(function(err) {

			// 		});
			// 	});

			// 	res.json({ message: 'Post created!' });
			// });

	// });

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

				post.views += 1;
				post.save(function(err) {
					if (err) throw err;
				});

				res.json(post);
			})
		})

		.put(function(req, res) {
			Post.findById(req.params.post_id, function(err, post) {
				if (err) res.send(err);
				// set the new post information if it exists in the request
				if (req.body.title) post.title = req.body.title;
				if (req.body.body) post.body = req.body.body;

				post.save(function(err) {
					if (err) res.send(err);
					res.json({ message: 'Post updated!' });
				});
			});
		})

		.delete(function(req, res) {

			// use request object to grab id ... if id is identical to author id on Post then it is allowed
			Post.remove({
				_id: req.params.post_id
			}, function(err, post) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	apiRouter.route('/posts/:post_id/upvote')
		.put(function(req, res) {
			Post.findById(req.params.post_id)
				.then(function(post) {
					var userObject = {};
					User.findById(post.authorId)
						.then(function(user) {
							var index = post.upvotes.indexOf(req.decoded._id);
							if (index === -1) {
								post.upvotes.push(req.decoded._id);
								user.upvotes += 1;
							} else {
								post.upvotes.splice(index, 1);
								user.upvotes -= 1;
							}
							user.save(function(err) {
								if (err) res.send(err);
							})
							var userObject = user;

							post.save(function(err) {
								if (err) res.send(err);
							});

							res.json({ "post": post, "author": userObject });
						});
				});
		});

	apiRouter.get('/me', function(req, res) {

		res.send(req.decoded);
	});

  return apiRouter;
};

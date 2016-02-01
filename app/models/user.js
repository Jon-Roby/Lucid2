var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		   = require('bcrypt-nodejs');

var UserSchema   = new Schema({
	name: String,
	username: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true, select: false },

	// The user's posts that have been favorited and liked
  posts: {type: Array},
	
	posts_favorited: [],
  // posts_favorited_count: {type: Number, default: 0},
	posts_upvoted: {type: Array},


	// The posts that the user has liked
	bookmarks: {type: Array},
  favorites: {type: Array},

	upvotes: {type: Number, default: 0},

	subscriptions: {type: Array},
	subscribers: {type: Array},

	photo: String,

	comments: {type: Number, default: 0}
});

// hash the password before the user is saved
UserSchema.pre('save', function(next) {
	var user = this;

	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		user.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);

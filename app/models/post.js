var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId     = require('mongoose').Schema.ObjectId;

var PostSchema   = new Schema({
	authorId: String,
	authorName: String,
	authorImage: String,
	title: String,
	body: String,

	views: {type: Number, default: 0},

	upvotes: [],


	favorites: [],

	bookmarks: [],

	// comments: [],
	// comments_count: {type: Number, default: 0},

	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);

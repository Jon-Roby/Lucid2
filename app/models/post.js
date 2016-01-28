var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId     = require('mongoose').Schema.ObjectId;

var PostSchema   = new Schema({
	authorId: String,
	authorName: String,
	title: String,
	body: String,

	upvotes: [],
	upvotes_count: {type: Number, default: 0},

	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  body: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  story: {
    title: String,
    id: String,
  },
  city: {
    name: String,
    id: String,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

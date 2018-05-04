const mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
  body: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
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
  }
});

let Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
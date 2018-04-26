const mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  body: String
});

let Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
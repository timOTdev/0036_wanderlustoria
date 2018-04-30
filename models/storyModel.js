const mongoose = require("mongoose");

let storySchema = new mongoose.Schema({
  title: String,
  date: String,
  photo: String,
  headline: String,
  body: String,
  comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    city: {
        id: String,
        name: String,
        country: String,
    }
});

let Story = mongoose.model("Story", storySchema);

module.exports = Story;
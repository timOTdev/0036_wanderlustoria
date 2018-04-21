const mongoose = require("mongoose");

let storySchema = new mongoose.Schema({
  title: String,
  date: String,
  photo: String,
  story: String
});

let Story = mongoose.model("Story", storySchema);

module.exports = Story;
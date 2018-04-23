const mongoose = require("mongoose");

let storySchema = new mongoose.Schema({
  title: String,
  date: String,
  photo: String,
  headline: String,
  body: String
});

let Story = mongoose.model("Story", storySchema);

module.exports = Story;
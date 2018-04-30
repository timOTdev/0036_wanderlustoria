const mongoose = require("mongoose");

let storySchema = new mongoose.Schema({
    title: String,
    location: String,
    date: String,
    body: String,
    author: {
        name: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    image: {
        name: String,
        id: String
    },
    city: {
        name: String,
        country: String,
        id: String,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
});

let Story = mongoose.model("Story", storySchema);

module.exports = Story;
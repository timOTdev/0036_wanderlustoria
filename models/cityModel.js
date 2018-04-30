const mongoose = require("mongoose");

let citySchema = new mongoose.Schema({
    name: String,
    headline: String,
    country: String,
    image: String,
    imageId: String,
    description: String,
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
    },
    stories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story"
        }
    ],
});

let City = mongoose.model("City", citySchema);

module.exports = City;
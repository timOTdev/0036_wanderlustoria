const mongoose = require("mongoose");

let citySchema = new mongoose.Schema({
    name: String,
    country: String,
    image: String,
    imageId: String,
    headline: String,
    description: String,
    stories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story"
        }
    ],
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
    },
});

let City = mongoose.model("City", citySchema);

module.exports = City;
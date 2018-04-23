const mongoose = require("mongoose");

let citySchema = new mongoose.Schema({
    name: String,
    country: String,
    photo: String,
    headline: String,
    description: String,
    stories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story"
        }
    ]
});

let City = mongoose.model("City", citySchema);

module.exports = City;
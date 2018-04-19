const mongoose = require("mongoose");

let citySchema = new mongoose.Schema({
    name: String,
    country: String,
    photo: String,
    headline: String,
    description: String
})

let City = mongoose.model("City", citySchema);

module.exports = City;
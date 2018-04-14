const mongoose = require("mongoose");

let citySchema = new mongoose.Schema({
    city: String,
    country: String,
    photo: String,
    description: String
})

let City = mongoose.model("City", citySchema);

module.exports = City;
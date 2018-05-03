const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  password: String,
  body: {type: String, default: "No bio provided"},
  isAdmin: {type: Boolean, default: false},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    name: String,
    id: String,
  },
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  body: { type: String, default: 'No bio provided' },
  isAdmin: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    name: String,
    id: String,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

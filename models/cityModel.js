const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: String,
  country: String,
  tagline: String,
  description: String,
  image: String,
  imageId: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  stories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
    },
  ],
});

const City = mongoose.model('City', citySchema);

module.exports = City;

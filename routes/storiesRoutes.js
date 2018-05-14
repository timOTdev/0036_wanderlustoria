const express = require('express');
const router = express.Router({ mergeParams: true });
const middleware = require('../middleware');
const City = require('../models/cityModel');
const Story = require('../models/storyModel');

// CLOUDINARY AND MULTER SETUP
require('dotenv').config();
const multer = require('multer');
const cloudinary = require('cloudinary');
const storage = multer.diskStorage({
  filename(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
const upload = multer({ storage, fileFilter: imageFilter });
cloudinary.config({
  cloud_name: 'wanderlustoria',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GEOCODER SETUP
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_SERVER_API_KEY,
  formatter: null,
};
const geocoder = NodeGeocoder(options);

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, (req, res) => {
  City.findById(req.params.cityId, (err, city) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    return res.render('storiesNew', { city });
  });
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, upload.single('image'), (req, res) => {
  City.findById(req.params.cityId, (err, city) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      req.body.story.title = req.sanitize(req.body.story.title);
      req.body.story.date = req.sanitize(req.body.story.date);
      req.body.story.body = req.sanitize(req.body.story.body);
      req.body.story.author = {
        name: req.user.username,
        id: req.user._id,
      };
      req.body.story.image = {
        name: result.secure_url,
        id: result.public_id,
      };
      req.body.story.city = {
        name: city.name,
        country: city.country,
        id: req.params.cityId,
      };

      geocoder.geocode(req.body.story.locationName, (err, data) => {
        if (err || !data.length) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        req.body.story.location = {
          name: req.body.story.locationName,
          city: req.body.story.locationCity,
          country: req.body.story.locationCountry,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
        };
        Story.create(req.body.story, (err, story) => {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          city.stories.push(story);
          city.save();
          return res.redirect(`/cities/${req.params.cityId}`);
        });
        return data;
      });
      return result;
    });
    return city;
  });
});

// SHOW ROUTE
router.get('/stories/:storyId', (req, res) => {
  City.findById(req.params.cityId, (err, city) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    Story.findById(req.params.storyId).populate({ path: 'comments', options: { sort: { createdAt: -1 } } }).exec((err, story) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      return res.render('storiesShow', { city, story });
    });
    return city;
  });
});

// EDIT ROUTE
router.get('/stories/:storyId/edit', middleware.checkStoryOwner, (req, res) => {
  City.findById(req.params.cityId, (err, city) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    Story.findById(req.params.storyId, (err, story) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      return res.render('storiesEdit', { city, story });
    });
    return city;
  });
});

// UPDATE ROUTE
router.put('/stories/:storyId', middleware.checkStoryOwner, upload.single('image'), (req, res) => {
  Story.findById(req.params.storyId, async (err, foundStory) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    if (req.file) {
      try {
        await cloudinary.v2.uploader.destroy(foundStory.image.id);
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        foundStory.image.name = result.secure_url;
        foundStory.image.id = result.public_id;
      } catch (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
    }
    foundStory.title = req.sanitize(req.body.story.title);
    foundStory.location.name = req.sanitize(req.body.story.locationName);
    foundStory.location.city = req.sanitize(req.body.story.locationCity);
    foundStory.location.country = req.sanitize(req.body.story.locationCountry);
    foundStory.location.latitude = req.sanitize(req.body.story.locationLatitude);
    foundStory.location.longitude = req.sanitize(req.body.story.locationLongitude);
    foundStory.date = req.sanitize(req.body.story.date);
    foundStory.body = req.sanitize(req.body.story.body);
    foundStory.save();
    req.flash('success', 'Story updated');
    return res.redirect(`/cities/${req.params.cityId}/stories/${req.params.storyId}`);
  });
});

// DESTROY ROUTE
router.delete('/stories/:storyId', middleware.checkStoryOwner, (req, res) => {
  Story.findById(req.params.storyId, async (err, story) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('back');
    } try {
      await cloudinary.v2.uploader.destroy(story.image.id);
      story.remove();
      req.flash('success', 'Story deleted');
      res.redirect(`/cities/${req.params.cityId}`);
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('back');
    }
  });
});

module.exports = router;

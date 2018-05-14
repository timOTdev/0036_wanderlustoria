const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const City = require('../models/cityModel');

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
  return cb(null, true);
};
const upload = multer({ storage, fileFilter: imageFilter });
cloudinary.config({
  cloud_name: 'wanderlustoria',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// INDEX ROUTE
router.get('/', (req, res) => {
  const perPage = 9;
  const pageQuery = parseInt(req.query.page);
  const pageNumber = pageQuery ? pageQuery : 1;
  let noMatch = null;

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    City.find({ name: regex })
      .skip((perPage * pageNumber) - perPage)
      .limit(perPage)
      .exec((err, allCities) => {
        City.count({ name: regex }).exec((err, count) => {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          } else if (allCities.length === 0) {
            noMatch = 'No matches found.';
          }
          return res.render('citiesIndex', {
            cities: allCities,
            noMatch,
            current: pageNumber,
            pages: Math.ceil(count / perPage),
            search: req.query.search,
          });
        });
      });
  } else {
    City.find({})
      .skip((perPage * pageNumber) - perPage)
      .limit(perPage)
      .exec((err, allCities) => {
        City.count().exec((err, count) => {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          return res.render('citiesIndex', {
            cities: allCities,
            current: pageNumber,
            pages: Math.ceil(count / perPage),
            noMatch: null,
            search: false,
          });
        });
      });
  }
});

// NEW ROUTE
router.get('/new', middleware.isAdminAccount, (req, res) => {
  res.render('citiesNew');
});

// CREATE ROUTE
router.post('/', middleware.isAdminAccount, upload.single('image'), (req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      req.flash('err', err.message);
      return res.redirect('back');
    }
    req.body.city.name = req.sanitize(req.body.city.name);
    req.body.city.country = req.sanitize(req.body.city.country);
    req.body.city.tagline = req.sanitize(req.body.city.tagline);
    req.body.city.description = req.sanitize(req.body.city.description);
    req.body.city.image = result.secure_url;
    req.body.city.imageId = result.public_id;
    req.body.city.author = {
      id: req.user._id,
      username: req.sanitize(req.user.username),
    };
    City.create(req.body.city, (err) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      return res.redirect('/cities');
    });
    return result;
  });
});

// SHOW ROUTE
router.get('/:cityId', (req, res) => {
  City.findById(req.params.cityId).populate({ path: 'stories', options: { sort: { createdAt: -1 } } }).exec((err, city) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    return res.render('citiesShow', { city });
  });
});

// EDIT ROUTE
router.get('/:cityId/edit', middleware.isAdminAccount, (req, res) => {
  City.findById(req.params.cityId, (err, city) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    return res.render('citiesEdit', { city });
  });
});

// UPDATE ROUTE
router.put('/:cityId', middleware.isAdminAccount, upload.single('image'), (req, res) => {
  City.findById(req.params.cityId, async (err, foundCity) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    if (req.file) {
      try {
        await cloudinary.v2.uploader.destroy(foundCity.imageId);
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        foundCity.image = result.secure_url;
        foundCity.imageId = result.public_id;
      } catch (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
    }
    foundCity.name = req.sanitize(req.body.city.name);
    foundCity.country = req.sanitize(req.body.city.country);
    foundCity.tagline = req.sanitize(req.body.city.tagline);
    foundCity.description = req.sanitize(req.body.city.description);
    foundCity.save();
    req.flash('success', 'City updated');
    return res.redirect(`/cities/${req.params.cityId}`);
  });
});

// DESTROY ROUTE
router.delete('/:cityId', middleware.isAdminAccount, (req, res) => {
  City.findById(req.params.cityId, async (err, foundCity) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('back');
    } try {
      cloudinary.v2.uploader.destroy(foundCity.imageId);
      foundCity.remove();
      req.flash('success', 'City deleted');
      res.redirect('/cities');
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('back');
    }
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;

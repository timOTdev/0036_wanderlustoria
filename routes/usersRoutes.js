const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require('../middleware');
require('express-sanitizer');

const User = require('../models/userModel');
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

// NEW ROUTE
router.get('/register', (req, res) => {
  res.render('usersNew');
});

// CREATE ROUTE
router.post('/register', upload.single('image'), (req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
    const newUser = new User({
      firstName: req.sanitize(req.body.firstName),
      lastName: req.sanitize(req.body.lastName),
      email: req.sanitize(req.body.email),
      username: req.sanitize(req.body.username),
      image: {
        name: result.secure_url,
        id: result.public_id,
      },
    });

    if (err) {
      req.flash('err', err.message);
      return res.redirect('back');
    }
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/register');
      }
      passport.authenticate('local')(req, req, () => {
        req.flash('success', `Welcome to Wanderlustoria, ${user.username}!`);
        res.redirect('/cities');
      });
      return user;
    });
    return result;
  });
});

// SHOW ROUTE
router.get('/users/:userId', middleware.isLoggedIn, (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/cities');
    }
    Story.find().where('author.id').equals(user._id).exec((err, stories) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/cities');
      }
      return res.render('usersShow', { user, stories });
    });
    return user;
  });
});

// EDIT ROUTE
router.get('/users/:userId/edit', middleware.checkProfileOwner, (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/cities');
    }
    return res.render('usersEdit', { user });
  });
});

// UPDATE ROUTE
router.put('/users/:userId', middleware.checkProfileOwner, upload.single('image'), (req, res) => {
  User.findById(req.params.userId, async (err, user) => {
    if (req.file) {
      try {
        await cloudinary.v2.uploader.destroy(user.image.id);
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        user.image.name = result.secure_url;
        user.image.id = result.profile_id;
      } catch (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
    }
    user.firstName = req.sanitize(req.body.firstName);
    user.lastName = req.sanitize(req.body.lastName);
    user.email = req.sanitize(req.body.email);
    user.body = req.sanitize(req.body.body);
    user.save();
    req.flash('success', 'User updated');
    return res.redirect(`/users/${req.params.userId}`);
  });
});

// DESTROY ROUTE
router.delete('/users/:userId', middleware.checkProfileOwner, (req, res) => {
  User.findById(req.params.userId, async (err, user) => {
    try {
      await cloudinary.v2.uploader.destroy(user.image.id);
      user.remove();
      req.flash('success', 'User deleted');
      res.redirect('/cities');
    } catch (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    return user;
  });
});

module.exports = router;

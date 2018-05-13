require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require('../middleware');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/userModel');
const Story = require('../models/storyModel');
const Comment = require('../models/commentModel');
const moment = require('moment');
require('express-sanitizer');

// INDEX ROUTES
router.get('/', (req, res) => res.render('introIndex'));

router.get('/home', (req, res) => {
  Story.find({}).sort('-createdAt').limit(5).exec((err, stories) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    Comment.find({}).sort('-createdAt').limit(5).exec((err, comments) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      return res.render('homeIndex', { stories, comments, moment });
    });
    return stories;
  });
});

// LOGIN ROUTES
router.get('/login', (req, res) => {
  res.render('loginIndex');
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: 'Welcome back!',
}), (req, res) => {
  if (req.user.isAdmin === true) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/cities');
});

// FORGOT PASSWORD ROUTES
router.get('/forgot', (req, res) => {
  res.render('forgotIndex');
});

router.post('/forgot', (req, res, next) => {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, (err, buf) => {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          req.flash('error', 'No account found with that email address.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save((err) => {
          done(err, token, user);
        });
        return user;
      });
    },
    function (token, user, done) {
      const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'timh1203@gmail.com',
          pass: process.env.GMAILPW,
        },
      });
      const mailOptions = {
        to: user.email,
        from: 'timh1203@gmail.com',
        subject: 'Wanderlustoria Password Reset',
        text: `
        You are receiving this because you (or someone else) have requested the reset of the password for your account.

        Please click on the following link, or paste this into your browser to complete the process:

        http://${req.headers.host}/reset/${token}

        If you did not request this, please ignore this email and your password will remain unchanged.

        With love, Wanderlustoria`,
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('success', `An e-mail has been sent to ${user.email} with further instructions.`);
        done(err, 'done');
      });
    },
  ], (err) => {
    if (err) { return next(err); }
    return res.redirect('/forgot');
  });
});

router.get('/reset/:token', (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    return res.render('resetIndex', { token: req.params.token, user });
  });
});

router.post('/reset/:token', (req, res) => {
  async.waterfall([
    function (done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if (req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, (err, user) => {
            if (err) {
              req.flash('error', 'Passwords do not match.');
              return res.redirect('back');
            }
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save((err, user) => {
              if (err) {
                req.flash('error', 'Passwords do not match.');
                return res.redirect('back');
              }
              req.logIn(user, (err) => {
                if (err) {
                  req.flash('error', 'Passwords do not match.');
                  return res.redirect('back');
                }
                return done(err, user);
              });
              return user;
            });
            return user;
          });
        } else {
          req.flash('error', 'Passwords do not match.');
          return res.redirect('back');
        }
        return user;
      });
    },
    function (user, done) {
      const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'timh1203@gmail.com',
          pass: process.env.GMAILPW,
        },
      });
      const mailOptions = {
        to: user.email,
        from: 'timh1203@mail.com',
        subject: 'Your password has been changed',
        text: `
        Hello,

        This is a confirmation that the password for your account ${user.email} has just been changed.

        With love, Wanderlustoria`,
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        req.flash('success', 'Success! Your password has been changed.');
        return done(err);
      });
    },
  ], (err) => {
    if (err) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('back');
    }
    return res.redirect('/cities');
  });
});

// LOGOUT ROUTES
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Successful logout!');
  res.redirect('back');
});

// DASHBOARD ROUTES
router.get('/dashboard', middleware.isAdminAccount, (req, res) => {
  User.find({}).sort('-createdAt').limit(20).exec((err, users) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    Story.find({}).sort('-createdAt').limit(20).exec((err, stories) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      Comment.find({}).sort('-createdAt').limit(20).exec((err, comments) => {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        return res.render('dashboardIndex', { users, stories, comments });
      });
      return stories;
    });
    return users;
  });
});

module.exports = router;

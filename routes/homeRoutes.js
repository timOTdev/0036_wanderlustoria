const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../middleware");
const expressSanitizer = require("express-sanitizer")
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require('dotenv').config();
const User = require("../models/userModel")

// INDEX ROUTES
router.get('/', function(req, res){
    res.render("introIndex");
});

router.get('/home', function(req,res){
    res.render("homeIndex");
});

// LOGIN ROUTES
router.get("/login", function(req, res){
    res.render("loginIndex");
});

router.post('/login',passport.authenticate('local', {
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome back!"
}), (req, res) => {
    if (req.user.isAdmin === true) {
    res.redirect('/dashboard');
    } else {
    res.redirect('/cities');
    }
});

// FORGOT PASSWORD ROUTES
router.get('/forgot', function(req, res) {
    res.render('forgotIndex');
  });
  
  router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account found with that email address.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'timh1203@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'timh1203@gmail.com',
          subject: 'Wanderlustoria Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n\n' +
            'With love, Wanderlustoria'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, foundUser) {
      if (!foundUser) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('resetIndex', {token: req.params.token, user: foundUser});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'timh1203@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'timh1203@mail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n\n' +
            'With love, Wanderlustoria'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/cities');
    });
  });

// LOGOUT ROUTES
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successful logout!")
    res.redirect("back");
});

// DASHBOARD ROUTES
router.get('/dashboard', middleware.isAdminAccount, function(req,res){
    res.render("dashboardIndex");
});

module.exports = router;
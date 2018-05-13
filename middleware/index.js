const User = require('../models/userModel');
const Story = require('../models/storyModel');
const Comment = require('../models/commentModel');

const middlewareObj = {};

middlewareObj.isAdminAccount = function (req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next();
    }
  }
  req.flash('error', 'You need to be an admin');
  return res.redirect('/login');
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in');
  return res.redirect('/login');
};

middlewareObj.checkProfileOwner = function (req, res, next) {
  if (req.isAuthenticated()) {
    User.findById(req.params.userId, (err, foundUser) => {
      if (err) {
        req.flash('error', 'User not found');
        res.redirect('back');
      } else {
        if (foundUser._id.equals(req.user._id) || req.user.isAdmin) {
          next();
        }
        req.flash('error', 'You do not have permission');
        return res.redirect('/cities');
      }
      return foundUser;
    });
  } else {
    req.flash('error', 'You need to be logged in');
    res.redirect('/login');
  }
};

middlewareObj.checkStoryOwner = function (req, res, next) {
  if (req.isAuthenticated()) {
    Story.findById(req.params.storyId, (err, foundStory) => {
      if (err) {
        req.flash('error', 'Story not found');
        res.redirect('back');
      } else {
        if (foundStory.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        }
        req.flash('error', 'You do not have permission');
        return res.redirect('back');
      }
      return foundStory;
    });
  } else {
    req.flash('error', 'You need to be logged in');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwner = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.commentId, (err, foundComment) => {
      if (err) {
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        }
        req.flash('error', 'You do not have permission');
        return res.redirect('back');
      }
      return foundComment;
    });
  } else {
    req.flash('error', 'You need to be logged in');
    res.redirect('back');
  }
};

module.exports = middlewareObj;

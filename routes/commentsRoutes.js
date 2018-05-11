const express = require('express');
const router = express.Router({ mergeParams: true });
const City = require('../models/cityModel');
const Story = require('../models/storyModel');
const Comment = require('../models/commentModel');
const middleware = require('../middleware');

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, (req, res) => {
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
      return res.render('commentsNew', { city, story });
    });
    return city;
  });
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, (req, res) => {
  req.body.comment.body = req.sanitize(req.body.comment.body);

  City.findById(req.params.cityId, (err, foundCity) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    Story.findById(req.params.storyId, (err, foundStory) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      Comment.create(req.body.comment, (err, newComment) => {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        newComment.author.id = req.user._id;
        newComment.author.username = req.user.username;
        newComment.story.title = foundStory.title;
        newComment.story.id = foundStory.id;
        newComment.city.name = foundCity.name;
        newComment.city.id = foundCity.id;
        newComment.save();
        foundStory.comments.push(newComment);
        foundStory.save();
        return res.redirect(`/cities/${req.params.cityId}/stories/${req.params.storyId}`);
      });
      return foundStory;
    });
    return foundCity;
  });
});

// EDIT ROUTE
router.get('/comments/:commentId/edit', middleware.checkCommentOwner, (req, res) => {
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
      Comment.findById(req.params.commentId, (err, comment) => {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        return res.render('commentsEdit', { city, story, comment });
      });
      return story;
    });
    return city;
  });
});

// UPDATE ROUTE
router.put('/comments/:commentId', middleware.checkCommentOwner, (req, res) => {
  req.body.comment.body = req.sanitize(req.body.comment.body);

  Comment.findByIdAndUpdate(req.params.commentId, { body: req.body.comment.body }, (err) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    return res.redirect(`/cities/${req.params.cityId}/stories/${req.params.storyId}`);
  });
});

// DESTROY ROUTE
router.delete('/comments/:commentId', middleware.checkCommentOwner, (req, res) => {
  Comment.findByIdAndRemove(req.params.commentId, (err) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    return res.redirect(`/cities/${req.params.cityId}/stories/${req.params.storyId}`);
  });
});

module.exports = router;

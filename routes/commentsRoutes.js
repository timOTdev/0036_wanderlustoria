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
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.story.title = story.title;
        comment.story.id = story.id;
        comment.city.name = city.name;
        comment.city.id = city.id;
        comment.save();
        story.comments.push(comment);
        story.save();
        return res.redirect(`/cities/${req.params.cityId}/stories/${req.params.storyId}`);
      });
      return story;
    });
    return city;
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

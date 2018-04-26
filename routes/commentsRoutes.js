const express = require("express");
const router  = express.Router({mergeParams: true});
const City = require("../models/cityModel");
const Story = require("../models/storyModel");
const Comment = require("../models/commentModel");
const middleware = require("../middleware");

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
  City.findById(req.params.cityId, function(err, foundCity){
    if(err){
      console.log(err);
    } else {
      Story.findById(req.params.storyId, function(err, foundStory){
        if(err){
          console.log(err);
        } else {
          res.render("commentsNew", {city: foundCity, story: foundStory});
        }
      })
    }
  });
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
  req.body.comment.body = req.sanitize(req.body.comment.body);

  City.findById(req.params.cityId, function(err, foundCity){
    if(err){
      console.log(err);
    } else {
      Story.findById(req.params.storyId, function(err, foundStory){
        if(err){
          console.log(err);
        } else {
          Comment.create(req.body.comment, function(err, newComment){
            if(err){
              console.log(err);
            } else {
              newComment.author.id = req.user._id
              newComment.author.username = req.user.username
              newComment.save();
              foundStory.comments.push(newComment);
              foundStory.save();
              res.redirect("/cities/" + req.params.cityId + "/stories/" + req.params.storyId);
            }
          })
        }
      })
    }
  });
});

// EDIT ROUTE
router.get("/comments/:commentId/edit", middleware.checkCommentOwner, function(req, res){
  City.findById(req.params.cityId, function(err, foundCity){
    if(err){
        console.log(err);
    } else {
      Story.findById(req.params.storyId, function(err, foundStory){
        if(err){
          console.log(err);
        } else {
          Comment.findById(req.params.commentId, function(err, foundComment){
            if(err){
              console.log(err);
            } else {
              res.render("commentsEdit", {city: foundCity, story: foundStory, comment: foundComment});
            }
          })
        }
      })
    }
  });
})

// UPDATE ROUTE
router.put("/comments/:commentId", middleware.checkCommentOwner, function(req, res){
  req.body.comment.body = req.sanitize(req.body.comment.body);

  Comment.findByIdAndUpdate(req.params.commentId, {body: req.body.comment.body}, function(err, foundComment){
    if(err){
      console.log(err);
    } else {
      res.redirect("/cities/" + req.params.cityId + "/stories/" + req.params.storyId);
    }
  });
});

// DESTROY ROUTE
router.delete("/comments/:commentId", middleware.checkCommentOwner, function(req, res){
  Comment.findByIdAndRemove(req.params.commentId, function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/cities/" + req.params.cityId + "/stories/" + req.params.storyId);
    }
  })
})

module.exports = router;
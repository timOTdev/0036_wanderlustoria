const express = require("express");
const router  = express.Router({mergeParams: true});
const City = require("../models/cityModel");
const Story = require("../models/storyModel");
const Comment = require("../models/commentModel");

// NEW ROUTE
router.get("/new", function(req, res){
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
router.post("/", function(req, res){
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
router.get("/comments/:commentId/edit", function(req, res){
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
router.put("/comments/:commentId", function(req, res){
  Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, foundComment){
    if(err){
      console.log(err);
    } else {
      res.redirect("/cities/" + req.params.cityId + "/stories/" + req.params.storyId);
    }
  });
});

// DESTROY ROUTE
router.delete("/comments/:commentId", function(req, res){
  Comment.findByIdAndRemove(req.params.commentId, function(err, foundComment){
    if(err){
      console.log(err);
      console.log(err);
    }else{
      res.redirect("/cities/" + req.params.cityId + "/stories/" + req.params.storyId);
    }
  })
})
module.exports = router;
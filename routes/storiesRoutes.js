const express = require("express");
const router  = express.Router({mergeParams: true});
const City = require("../models/cityModel");
const Story = require("../models/storyModel");

// NEW ROUTE
router.get("/new", function(req, res){
  City.findById(req.params.cityId, function(err, foundCity){
    if(err){
      console.log(err);
    } else {
      res.render("storiesNew", {city: foundCity});
    }
  });
});

// CREATE ROUTE
router.post("/", function(req, res){
  req.body.story.title = req.sanitize(req.body.story.title);
  req.body.story.date = req.sanitize(req.body.story.date);
  req.body.story.photo = req.sanitize(req.body.story.photo);
  req.body.story.headline = req.sanitize(req.body.story.headline);
  req.body.story.body = req.sanitize(req.body.story.body);

  City.findById(req.params.cityId, function(err, foundCity){
    if(err){
      console.log(err);
    } else {
      Story.create(req.body.story, function(err, newStory){
        if(err){
          console.log(err);
        } else {
          foundCity.stories.push(newStory);
          foundCity.save();
          res.redirect("/cities/" + req.params.cityId);
        }
      })
    }
  });
});

// SHOW ROUTE
router.get("/stories/:storyId", function(req, res){
  City.findById(req.params.cityId, function(err, foundCity){
    if(err){
      console.log(err);
    } else {
      Story.findById(req.params.storyId).populate("comments").exec(function(err, foundStory){
        if(err){
          console.log(err);
        } else {
          res.render("storiesShow", {city: foundCity, story: foundStory});
        }
      })
    }
  });
});


// EDIT ROUTE
router.get("/stories/:storyId/edit", function(req, res){
  City.findById(req.params.cityId, function(err, foundCity){
    if(err){
        console.log(err);
    } else {
      Story.findById(req.params.storyId, function(err, foundStory){
        if(err){
          console.log(err);
        } else {
          res.render("storiesEdit", {city: foundCity, story: foundStory});
        }
      })
    }
  });
});

// UPDATE ROUTE
router.put("/stories/:storyId", function(req, res){
  req.body.story.title = req.sanitize(req.body.story.title);
  req.body.story.date = req.sanitize(req.body.story.date);
  req.body.story.photo = req.sanitize(req.body.story.photo);
  req.body.story.headline = req.sanitize(req.body.story.headline);
  req.body.story.body = req.sanitize(req.body.story.body);

  Story.findByIdAndUpdate(req.params.storyId, req.body.story, function(err, foundStory){
    if(err){
      console.log(err);
    } else {
      res.redirect("/cities/" + req.params.cityId + "/stories/" + req.params.storyId);
    }
  });
});

// DESTROY ROUTE
router.delete("/stories/:storyId", function(req, res){
  Story.findByIdAndRemove(req.params.storyId, function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/cities/" + req.params.cityId);
    }
  });
});

module.exports = router;
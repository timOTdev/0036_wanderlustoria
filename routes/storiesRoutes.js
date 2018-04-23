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

module.exports = router;
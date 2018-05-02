const express = require("express");
const router  = express.Router({mergeParams: true});
const middleware = require("../middleware");
const City = require("../models/cityModel");
const Story = require("../models/storyModel");

// CLOUDINARY AND MULTER SETUP
const dotenv = require('dotenv').config();
const multer = require('multer');
const cloudinary = require('cloudinary');
let storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
let imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter})
cloudinary.config({ 
  cloud_name: 'wanderlustoria', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// GEOCODER SETUP
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
const geocoder = NodeGeocoder(options);

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
  City.findById(req.params.cityId, function(err, foundCity){
    if(err){
      console.log(err);
    } 
    else{
      res.render("storiesNew", {city: foundCity});
    }
  });
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
  City.findById(req.params.cityId, function(err, foundCity){
    if(err){
      console.log(err);
    } 
    else{
      cloudinary.v2.uploader.upload(req.file.path, function(err, result){
        if(err){
          req.flash("error", err.message);
          return res.redirect('back');
        }
        req.body.story.title = req.sanitize(req.body.story.title);
        req.body.story.location = req.sanitize(req.body.story.location);
        req.body.story.date = req.sanitize(req.body.story.date);
        req.body.story.body = req.sanitize(req.body.story.body);
        req.body.story.author = {
          name: req.user.username,
          id: req.user._id,
        }
        req.body.story.image = {
          name: result.secure_url,
          id: result.public_id,
        }
        req.body.story.city = {
          name: foundCity.name,
          country: foundCity.country,
          id: req.params.cityId,
        }
        
        geocoder.geocode(req.body.story.locationName, function (err, data) {
          if (err || !data.length) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          req.body.story.location = {
            name: req.body.story.locationName,
            city: req.body.story.locationCity,
            country: req.body.story.locationCountry,
            lat: data[0].latitude,
            lng: data[0].longitude,
          }
          Story.create(req.body.story, function(err, newStory){
            if(err){
              req.flash("error", err.message);
              return res.redirect("back");
            } 
            else{
              foundCity.stories.push(newStory);
              foundCity.save();
              res.redirect("/cities/" + req.params.cityId);
            }
          })
        });
      })
    }
  });
});

// SHOW ROUTE
router.get("/stories/:storyId", function(req, res){
  City.findById(req.params.cityId, function(err, foundCity){
    if(err){
      console.log(err);
    } 
    else{
      Story.findById(req.params.storyId).populate("comments").exec(function(err, foundStory){
        if(err){
          console.log(err);
        } 
        else{
          res.render("storiesShow", {city: foundCity, story: foundStory});
        }
      })
    }
  });
});

// EDIT ROUTE
router.get("/stories/:storyId/edit", middleware.checkStoryOwner, function(req, res){
  City.findById(req.params.cityId, function(err, foundCity){
    if(err){
        console.log(err);
    } 
    else{
      Story.findById(req.params.storyId, function(err, foundStory){
        if(err){
          console.log(err);
        } 
        else{
          res.render("storiesEdit", {city: foundCity, story: foundStory});
        }
      })
    }
  });
});

// UPDATE ROUTE
router.put("/stories/:storyId", middleware.checkStoryOwner, upload.single('image'), function(req, res){
  Story.findById(req.params.storyId, async function(err, foundStory){
    if(err){
      req.flash("error", err.message);
      return res.redirect("back");
    }
    else{
      if(req.file){
        try{
          await cloudinary.v2.uploader.destroy(foundStory.image.id);
          let result = await cloudinary.v2.uploader.upload(req.file.path);
          foundStory.image.name = result.secure_url;
          foundStory.image.id = result.public_id;
        }
        catch(err){
          req.flash("error", err.message);
          return res.redirect("back");
        }
      }
      foundStory.title = req.sanitize(req.body.story.title);
      foundStory.location = req.sanitize(req.body.story.location);
      foundStory.date = req.sanitize(req.body.story.date);
      foundStory.body = req.sanitize(req.body.story.body);
      foundStory.save();
      req.flash("success", "Story updated");
      res.redirect("/cities/" + req.params.cityId + "/stories/" + req.params.storyId);
    }
  })
});

// DESTROY ROUTE
router.delete("/stories/:storyId", middleware.checkStoryOwner, function(req, res){
  Story.findById(req.params.storyId, async function(err, foundStory){
    if(err){
      req.flash("error", err.message);
      res.redirect("back");
    }
    try{
      await cloudinary.v2.uploader.destroy(foundStory.image.id);
      foundStory.remove();
      req.flash("success", "Story deleted")
      res.redirect("/cities/" + req.params.cityId);
    }
    catch(err){
      req.flash("error", err.message);
      res.redirect("back");
    }
  });
});

module.exports = router;
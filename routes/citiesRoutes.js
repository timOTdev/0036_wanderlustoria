const express = require("express");
const router = express.Router();
const City = require("../models/cityModel");
const middleware = require("../middleware");

// INDEX ROUTE
router.get('/', function(req, res){
    City.find({}, function(err, allCities){
        if(err){
            console.log(err);
        } else {
            res.render("citiesIndex", {cities: allCities});
        }
    });
});

// NEW ROUTE
router.get('/new', middleware.isAdminAccount, function(req, res){
    res.render("citiesNew");
});

// CREATE ROUTE
router.post('/', middleware.isAdminAccount, function(req, res){
    req.body.city.name = req.sanitize(req.body.city.name);
    req.body.city.country = req.sanitize(req.body.city.country);
    req.body.city.photo = req.sanitize(req.body.city.photo);
    req.body.city.headline = req.sanitize(req.body.city.headline);
    req.body.city.description = req.sanitize(req.body.city.description);
    req.body.city.author = {
        id: req.user._id,
        username: req.user.username
    };
    City.create(req.body.city, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/cities");
        }
    });
});

// SHOW ROUTE
router.get('/:cityId', function(req, res){
    City.findById(req.params.cityId).populate("stories").exec(function(err, foundCity){
        if(err){
            console.log(err);
        } else {
            res.render("citiesShow", {city: foundCity});
        }
    });
  });

// EDIT ROUTE
router.get("/:cityId/edit", middleware.isAdminAccount, function(req, res){
    City.findById(req.params.cityId, function(err, foundCity){
        if(err){
            console.log(err);
        } else {
            res.render("citiesEdit", {city: foundCity});
        }
    });
});

// UPDATE ROUTE
router.put("/:cityId", middleware.isAdminAccount, function(req, res){
    req.body.city.name = req.sanitize(req.body.city.name);
    req.body.city.country = req.sanitize(req.body.city.country);
    req.body.city.photo = req.sanitize(req.body.city.photo);
    req.body.city.headline = req.sanitize(req.body.city.headline);
    req.body.city.description = req.sanitize(req.body.city.description);
    
    City.findByIdAndUpdate(req.params.cityId, {
        name: req.body.city.name,
        country: req.body.city.country,
        photo: req.body.city.photo,
        headline: req.body.city.headline,
        description: req.body.city.description,
      }, function(err, updatedCity){
        if(err){
            res.redirect("/cities");
        } else {
            res.redirect("/cities/" + req.params.cityId);
        }
    });
});

// DESTROY ROUTE
router.delete("/:cityId", middleware.isAdminAccount, function(req, res){
    City.findByIdAndRemove(req.params.cityId, function(err){
        if(err){
            res.redirect("/cities");
        } else {
            res.redirect("/cities");
        }
    });
});

module.exports = router;
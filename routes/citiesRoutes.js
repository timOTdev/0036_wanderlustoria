const express = require("express");
const router = express.Router();
const City = require("../models/cityModel");

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
router.get('/new', function(req, res){
    res.render("citiesNew");
});

// CREATE ROUTE
router.post('/', function(req, res){
    req.body.city.name = req.sanitize(req.body.city.name);
    req.body.city.country = req.sanitize(req.body.city.country);
    req.body.city.photo = req.sanitize(req.body.city.photo);
    req.body.city.headline = req.sanitize(req.body.city.headline);
    req.body.city.description = req.sanitize(req.body.city.description);

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
router.get("/:cityId/edit", function(req, res){
    City.findById(req.params.cityId, function(err, foundCity){
        if(err){
            console.log(err);
        } else {
            res.render("citiesEdit", {city: foundCity});
        }
    });
});

// UPDATE ROUTE
router.put("/:cityId", function(req, res){
    req.body.city.name = req.sanitize(req.body.city.name);
    req.body.city.country = req.sanitize(req.body.city.country);
    req.body.city.photo = req.sanitize(req.body.city.photo);
    req.body.city.headline = req.sanitize(req.body.city.headline);
    req.body.city.description = req.sanitize(req.body.city.description);
    
    City.findByIdAndUpdate(req.params.cityId, req.body.city, function(err, updatedCity){
        if(err){
            res.redirect("/cities");
        } else {
            res.redirect("/cities/" + req.params.cityId);
        }
    });
});

// DESTROY ROUTE
router.delete("/:cityId", function(req, res){
    City.findByIdAndRemove(req.params.cityId, function(err){
        if(err){
            res.redirect("/cities");
        } else {
            res.redirect("/cities");
        }
    });
});

module.exports = router;
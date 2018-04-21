const express = require("express");
const router = express.Router();
const City = require("../models/citySchema");

// INDEX ROUTE
router.get('/', function(req, res){
    City.find({}, function(err, allCities){
        if(err){
            console.log(err);
        } else {
            res.render("wanderlustoriaIndex", {cities: allCities});
        }
    });
});

// NEW ROUTE
router.get('/new', function(req, res){
    res.render("wanderlustoriaNew");
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
            res.redirect("/wanderlustoria");
        }
    });
});

// SHOW ROUTE
router.get('/:id', function(req, res){
    City.findById(req.params.id, function(err, foundCity){
        if(err){
            console.log(err);
        } else {
            res.render("wanderlustoriaShow", {city: foundCity});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", function(req, res){
    City.findById(req.params.id, function(err, foundCity){
        if(err){
            console.log(err);
        } else {
            res.render("wanderlustoriaEdit", {city: foundCity});
        }
    });
});

// UPDATE ROUTE
router.put("/:id", function(req, res){
    req.body.city.name = req.sanitize(req.body.city.name);
    req.body.city.country = req.sanitize(req.body.city.country);
    req.body.city.photo = req.sanitize(req.body.city.photo);
    req.body.city.headline = req.sanitize(req.body.city.headline);
    req.body.city.description = req.sanitize(req.body.city.description);
    
    City.findByIdAndUpdate(req.params.id, req.body.city, function(err, updatedCity){
        if(err){
            res.redirect("/wanderlustoria");
        } else {
            res.redirect("/wanderlustoria/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
router.delete("/:id", function(req, res){
    City.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/wanderlustoria");
        } else {
            res.redirect("/wanderlustoria");
        }
    });
});

module.exports = router;
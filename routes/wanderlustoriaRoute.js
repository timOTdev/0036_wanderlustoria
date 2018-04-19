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
    })
});

// CREATE ROUTE
router.post('/', function(req, res){
    let city = req.body.city;
    let country = req.body.country;
    let photo = req.body.photo;
    let description = req.body.description;
    
    let newCity = {city:city, country:country, photo:photo, description:description};
    City.create(newCity, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/wanderlustoria");
        }
    });
});

// NEW ROUTE
router.get('/new', function(req, res){
    res.render("wanderlustoriaNew");
});

// SHOW ROUTE
router.get('/:id', function(req, res){
    City.findById(req.params.id, function(err, foundCity){
        if(err){
            console.log(err);
        } else {
            console.log(foundCity);
            res.render("wanderlustoriaShow", {city: foundCity});
        }
    });
});

module.exports = router;
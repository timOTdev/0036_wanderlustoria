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


// NEW ROUTE
router.get('/new', function(req, res){
    res.render("wanderlustoriaNew");
});

// CREATE ROUTE
router.post('/', function(req, res){
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
})

// UPDATE ROUTE
router.put("/:id", function(req, res){
    City.findByIdAndUpdate(req.params.id, req.body.city, function(err, updatedCity){
        if(err){
            res.redirect("/wanderlustoria");
        } else {
            res.redirect("/wanderlustoria/" + req.params.id);
        }
    })
})

module.exports = router;
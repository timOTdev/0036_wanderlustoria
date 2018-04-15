const express = require("express");
const router = express.Router();
const City = require("../models/citySchema");

// let cities = [
//     {name: "Medellin", country: "Colombia", image: "https://images.unsplash.com/photo-1512250431446-d0b4b57b27ec?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a44ca66de56c79c3f78639b5e948d17a&auto=format&fit=crop&w=1355&q=80"},
//     {name: "Chiang Mai", country: "Thailand", image: "https://images.unsplash.com/photo-1512553353614-82a7370096dc?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=643c6ebcaf321c2a939e57ed8c0eb485&auto=format&fit=crop&w=1489&q=80"},
//     {name: "Hoi An", country: "Vietnam", image: "https://images.unsplash.com/36/hGibbjg0Rb2fUIoMtU5l__DSC8099.jpg?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=89cdd0f896a0d49a26d8627cca6b41e3&auto=format&fit=crop&w=1418&q=80"}
// ];

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

module.exports = router;
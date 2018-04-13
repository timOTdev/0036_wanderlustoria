var express = require("express");
var router = express.Router();

var cities = [
    {name: "Medellin", country: "Colombia", image: "https://images.unsplash.com/photo-1512250431446-d0b4b57b27ec?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a44ca66de56c79c3f78639b5e948d17a&auto=format&fit=crop&w=1355&q=80"},
    {name: "Chiang Mai", country: "Thailand", image: "https://images.unsplash.com/photo-1512553353614-82a7370096dc?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=643c6ebcaf321c2a939e57ed8c0eb485&auto=format&fit=crop&w=1489&q=80"},
    {name: "Hoi An", country: "Vietnam", image: "https://images.unsplash.com/36/hGibbjg0Rb2fUIoMtU5l__DSC8099.jpg?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=89cdd0f896a0d49a26d8627cca6b41e3&auto=format&fit=crop&w=1418&q=80"}
];

// INDEX ROUTE
router.get('/', function(req, res){
    res.render("wanderlustoria/index", {cities: cities});
});

// NEW ROUTE
router.get('/new', function(req, res){
    res.render("wanderlustoria/new");
});

// CREATE ROUTE
router.post('/', function(req, res){
    console.log("You've just added " + req.body.nameCity + "!");
    console.log("You've just added " + req.body.nameCountry + "!");
    console.log("You've just added " + req.body.description + "!");
    res.redirect("/wanderlustoria");
});

module.exports = router;
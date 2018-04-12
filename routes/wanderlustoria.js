var express = require("express");
var router = express.Router();

// INDEX ROUTE
router.get('/', function(req, res){
    res.render("wanderlustoria/index");
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
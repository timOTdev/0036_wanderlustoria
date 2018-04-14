var express = require("express");
var router = express.Router();

// INDEX ROUTE
router.get('/', function(req, res){
    res.render("citiesIndex");
});

// NEW ROUTE
router.get('/new', function(req, res){
    res.render("citiesNew");
});

// CREATE ROUTE
router.post('/', function(req, res){
    res.redirect("citiesIndex");
});

module.exports = router;
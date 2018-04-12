var express = require("express");
var router = express.Router();

// INDEX ROUTE
router.get('/', function(req, res){
    res.render("cities/index");
});

// NEW ROUTE
router.get('/new', function(req, res){
    res.render("cities/new");
});

// CREATE ROUTE
router.post('/', function(req, res){
    res.redirect("/cities/index");
});

module.exports = router;
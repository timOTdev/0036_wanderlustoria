var express = require("express");
var router = express.Router();

// INDEX ROUTE
router.get('/', function(req, res){
    res.render("intro");
});

router.get('/home', function(req,res){
    res.render("home");
});

module.exports = router;
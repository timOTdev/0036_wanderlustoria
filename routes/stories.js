var express = require("express");
var router = express.Router();

// INDEX ROUTE
router.get('/', function(req, res){
    res.render("stories/index");
});

module.exports = router;
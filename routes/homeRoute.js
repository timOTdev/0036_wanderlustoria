const express = require("express");
const router = express.Router();

// INDEX ROUTE
router.get('/', function(req, res){
    res.render("introIndex");
});

router.get('/home', function(req,res){
    res.render("homeIndex");
});

module.exports = router;
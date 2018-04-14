const express = require("express");
const router = express.Router();

// INDEX ROUTE
router.get('/', function(req, res){
    res.render("storiesIndex");
});

module.exports = router;
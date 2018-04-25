const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userModel")

// INDEX ROUTE
router.get('/', function(req, res){
    res.render("introIndex");
});

router.get('/home', function(req,res){
    res.render("homeIndex");
});

// AUTH ROUTES
router.get("/register", function(req, res){
    res.render("registerIndex");
})

router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("registerIndex");
        }
        passport.authenticate("local")(req, req, function(){
            res.redirect("/cities");
        })
    })
})


module.exports = router;
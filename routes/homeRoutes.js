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

// REGISTER ROUTES
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

// LOGIN ROUTES
router.get("/login", function(req, res){
    res.render("loginIndex");
})

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/cities",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/cities");
});

module.exports = router;
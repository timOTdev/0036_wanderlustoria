const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userModel");
const middleware = require("../middleware");

// INDEX ROUTES
router.get('/', function(req, res){
    res.render("introIndex");
});

router.get('/home', function(req,res){
    res.render("homeIndex");
});

// DASHBOARD ROUTES
router.get('/dashboard', middleware.isAdminAccount, function(req,res){
    res.render("dashboardIndex");
});

// REGISTER ROUTES
router.get("/register", function(req, res){
    res.render("registerIndex");
})

router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, req, function(){
            req.flash("success", "Welcome to Wanderlustoria, " + user.username + "!")
            res.redirect("/cities");
        })
    })
})

// LOGIN ROUTES
router.get("/login", function(req, res){
    res.render("loginIndex");
})

router.post('/login',passport.authenticate('local', {
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome back!"
}), (req, res) => {
    if (req.user.isAdmin === true) {
    res.redirect('/dashboard');
    } else {
    res.redirect('/cities');
    }
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successful logout!")
    res.redirect("back");
});

module.exports = router;
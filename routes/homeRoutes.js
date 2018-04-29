const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../middleware");
const expressSanitizer = require("express-sanitizer")

// INDEX ROUTES
router.get('/', function(req, res){
    res.render("introIndex");
});

router.get('/home', function(req,res){
    res.render("homeIndex");
});

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

// DASHBOARD ROUTES
router.get('/dashboard', middleware.isAdminAccount, function(req,res){
    res.render("dashboardIndex");
});

module.exports = router;
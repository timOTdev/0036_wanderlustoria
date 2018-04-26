const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

// Models
const User = require("./models/userModel");

// Routes
const homeRoutes = require("./routes/homeRoutes");
const citiesRoutes = require("./routes/citiesRoutes");
const storiesRoutes = require("./routes/storiesRoutes");
const commentsRoutes = require("./routes/commentsRoutes");

// Setup
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
mongoose.connect("mongodb://localhost/wanderlustoria");

// Passport Configuration
app.use(require("express-session")({
    secret: "fernweh",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", homeRoutes);
app.use("/cities", citiesRoutes);
app.use("/cities/:cityId", storiesRoutes);
app.use("/cities/:cityId/stories/:storyId", commentsRoutes);

// Server Listener
app.listen(3000, function(){
    console.log("Wanderlustoria is running!");
});
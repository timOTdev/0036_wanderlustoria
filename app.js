const express = require("express");
const app = express();
var bodyParser = require("body-parser");

// Setup
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

// INDEX ROUTE
app.get('/', function(req, res){
    res.render("intro");
})

app.get('/home', function(req,res){
    res.render("home");
})

// NEW ROUTE
app.get('/destinations', function(req, res){
    res.render("destinations");
})

app.get('/destinations/new', function(req, res){
    res.render("addDestination");
})

// CREATE ROUTE
app.post('/destinations', function(req, res){
    console.log("You've just added " + req.body + "!");
    res.redirect("/destinations");
})

// Server Listener
app.listen(3000, function(){
    console.log("Wanderlustoria is running!");
})
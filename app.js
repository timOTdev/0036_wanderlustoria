const express = require("express");
const app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res){
    res.render("intro");
})

app.get('/destinations', function(req, res){
    res.render("destinations");
})

app.post('/destinations', function(req, res){
    console.log("You've just added " + req.body + "!");
    res.redirect("/destinations");
})

app.get('/destinations/add', function(req, res){
    res.render("addDestination");
})

app.listen(3000, function(){
    console.log("Wanderlustoria is running!");
})
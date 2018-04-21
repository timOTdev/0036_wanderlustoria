const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

// Routes
const homeRoutes = require("./routes/homeRoutes");
const citiesRoutes = require("./routes/citiesRoutes");

// Setup
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
mongoose.connect("mongodb://localhost/wanderlustoria");

app.use("/", homeRoutes);
app.use("/cities", citiesRoutes);

// Server Listener
app.listen(3000, function(){
    console.log("Wanderlustoria is running!");
});
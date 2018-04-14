const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Setup
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/wanderlustoria");

// Routes
const homeRoutes = require("./routes/homeRoute");
const wanderlustoriaRoutes = require("./routes/wanderlustoriaRoute");
const cityRoutes = require("./routes/citiesRoute");
const storiesRoutes = require("./routes/storiesRoute");

app.use("/", homeRoutes);
app.use("/wanderlustoria", wanderlustoriaRoutes);
app.use("/cities", cityRoutes);
app.use("/stories", storiesRoutes);

// Server Listener
app.listen(3000, function(){
    console.log("Wanderlustoria is running!");
});
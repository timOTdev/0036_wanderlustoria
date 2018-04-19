const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

// Routes
const homeRoutes = require("./routes/homeRoutes");
const wanderlustoriaRoutes = require("./routes/wanderlustoriaRoutes");
const cityRoutes = require("./routes/citiesRoutes");
const storiesRoutes = require("./routes/storiesRoutes");

// Setup
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/wanderlustoria");

app.use("/", homeRoutes);
app.use("/wanderlustoria", wanderlustoriaRoutes);
app.use("/cities", cityRoutes);
app.use("/stories", storiesRoutes);

// Server Listener
app.listen(3000, function(){
    console.log("Wanderlustoria is running!");
});
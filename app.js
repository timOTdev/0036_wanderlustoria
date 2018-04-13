const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Setup
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

// Routes
const homeRoutes = require("./routes/home");
const wanderlustoriaRoutes = require("./routes/wanderlustoria");
const cityRoutes = require("./routes/cities");
const storiesRoutes = require("./routes/stories");

app.use("/", homeRoutes);
app.use("/wanderlustoria", wanderlustoriaRoutes);
app.use("/cities", cityRoutes);
app.use("/stories", storiesRoutes);

// Server Listener
app.listen(3000, function(){
    console.log("Wanderlustoria is running!");
});
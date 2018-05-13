require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');

// Models
const User = require('./models/userModel');

// Routes
const homeRoutes = require('./routes/homeRoutes');
const usersRoutes = require('./routes/usersRoutes');
const citiesRoutes = require('./routes/citiesRoutes');
const storiesRoutes = require('./routes/storiesRoutes');
const commentsRoutes = require('./routes/commentsRoutes');

// Setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.use(flash());
app.locals.moment = require('moment');
mongoose.connect('mongodb://localhost/wanderlustoria');
// mongoose.connect(process.env.MLABDATABASE || 'mongodb://localhost/wanderlustoria');

// Passport Configuration
app.use(require('express-session')({
  secret: 'fernweh',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', homeRoutes);
app.use('/', usersRoutes);
app.use('/cities', citiesRoutes);
app.use('/cities/:cityId', storiesRoutes);
app.use('/cities/:cityId/stories/:storyId', commentsRoutes);

// Server Listener
app.listen(process.env.PORT || 3000, function() {
  console.log('Wanderlustoria is running!');
});

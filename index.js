// include modules
require('dotenv').config(); // loads the .env
const bodyParser = require('body-parser');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('./config/passportConfig');
const session = require('express-session');

// initialize app
const app = express();

// connect to database
mongoose.connect('mongodb://localhost/auth-boiler');

// set and use statements. set view engine and use middleware.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(expressLayouts);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// just a convenience, but makes life easier...
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

// top-level routes
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

// include any routes from controllers
app.use('/auth', require('./controllers/auth'));

// listen
app.listen(process.env.PORT || 3000);

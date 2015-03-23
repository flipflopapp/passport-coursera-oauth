var express = require('express')
  , session = require('express-session')
  , passport = require('passport')
  , util = require('util')
  , CourseraStrategy = require('./../../lib/passport-coursera-oauth').OAuth2Strategy;

// API Access link for creating client ID and secret:
// https://accounts.coursera.org/console/
var COURSERA_CLIENT_ID = "--insert-coursera-client-id-here--";
var COURSERA_CLIENT_SECRET = "--insert-coursera-client-secret-here--";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Coursera profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the CourseraStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken and Coursera
//   profile), and invoke a callback with a user object.
passport.use(new CourseraStrategy({
    clientID: COURSERA_CLIENT_ID,
    clientSecret: COURSERA_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/coursera/callback",
    profileFields: [ 'timezone', 'locale', 'privacy']
  },
  function(accessToken, profile, done) {
      console.log(profile);
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Coursera profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Coursera account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));




var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.use(require('express-ejs-layouts'));

app.use(require('morgan')('dev'));
//app.use(require('logger').createLogger());
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(require('cookie-parser')());
app.use(session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/coursera
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Coursera authentication will involve
//   redirecting the user to coursera.com.  After authorization, Coursera
//   will redirect the user back to this application at /auth/coursera/callback
app.get('/auth/coursera',
  passport.authenticate('coursera', { scope: ['view_profile'] }),
  function(req, res){
    // The request will be redirected to Coursera for authentication, so this
    // function will not be called.
  });

// GET /auth/coursera/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/coursera/callback', 
  passport.authenticate('coursera', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.use(express.static(__dirname + '/public'));

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

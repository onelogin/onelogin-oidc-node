require('dotenv').config();

var express = require('express');
var handlebars  = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Use Passport with OpenId Connect strategy to
// authenticate users with OneLogin
var passport = require('passport')
var OneLoginStrategy = require('passport-openidconnect').Strategy

var index = require('./routes/index');
var users = require('./routes/users');

//  acr_values: 'onelogin:nist:level:1:re-auth'
const baseUri = `${ process.env.OIDC_BASE_URI }/oidc/2`

// Configure the OpenId Connect Strategy
// with credentials obtained from OneLogin
passport.use(new OneLoginStrategy({
  issuer: baseUri,
  clientID: process.env.OIDC_CLIENT_ID,
  clientSecret: process.env.OIDC_CLIENT_SECRET,
  authorizationURL: `${baseUri}/auth`,
  userInfoURL: `${baseUri}/me`,
  tokenURL: `${baseUri}/token`,
  callbackURL: process.env.OIDC_REDIRECT_URI,
  passReqToCallback: true
},
function(req, issuer, userId, profile, accessToken, refreshToken, params, cb) {

  console.log('issuer:', issuer);
  console.log('userId:', userId);
  console.log('accessToken:', accessToken);
  console.log('refreshToken:', refreshToken);
  console.log('params:', params);

  req.session.accessToken = accessToken;
  req.session.idToken = params['id_token'];

  return cb(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var app = express();

// view engine setup
app.engine('.hbs', handlebars({
  extname: '.hbs',
  layoutsDir: 'views',
  defaultLayout: 'layout'
 }));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport requires session to persist the authentication
// so were using express-session for this example
app.use(session({
  secret: 'secret squirrel',
  resave: false,
  saveUninitialized: true
}))

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware for checking if a user has been authenticated
// via Passport and OneLogin OpenId Connect
function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      next();
  } else{
      res.redirect("/");
  }
}

app.use('/', index);
// Only allow authenticated users to access the /users route
app.use('/users', checkAuthentication, users);

// Initiates an authentication request with OneLogin
// The user will be redirect to OneLogin and once authenticated
// they will be returned to the callback handler below
app.get('/login', passport.authenticate('openidconnect', {
  successReturnToOrRedirect: "/",
  scope: 'profile'
}));

// Callback handler that OneLogin will redirect back to
// after successfully authenticating the user
app.get('/oauth/callback', passport.authenticate('openidconnect', {
  callback: true,
  successReturnToOrRedirect: '/users',
  failureRedirect: '/'
}))

// Destroy both the local session and
// revoke the access_token at OneLogin
app.get('/logout', function(req, res){

  // End the local session
  req.logout();

  // Redirect here after logout
  // This needs to be registered in the OIDC app settings within OneLogin
  let postLogoutUri = req.protocol + '://' + req.get('host');

  // End the session at OneLogin and then redirect back to this site
  let logoutUri = `${process.env.OIDC_BASE_URI}/oidc/2/logout?id_token_hint=${req.session.idToken}&post_logout_redirect_uri=${postLogoutUri}`;

  res.redirect(logoutUri);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

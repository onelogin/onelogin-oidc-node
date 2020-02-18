require('dotenv').config();

var request = require('request');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Use Passport with OpenId Connect strategy to
// authenticate users with OneLogin using Auth Code Flow + PKCE
var passport = require('passport')
const { Strategy } = require('openid-client');

var index = require('./routes/index');
var users = require('./routes/users');

var oidcIssuer = `https://${process.env.SUBDOMAIN}.onelogin.com/oidc/2`;

const { Issuer } = require('openid-client');
Issuer.discover(oidcIssuer) // => Promise
  .then(function (issuer) {
    console.log('Discovered issuer %s', issuer);

    const client = new issuer.Client({
      client_id: process.env.OIDC_CLIENT_ID,
      token_endpoint_auth_method: 'none'
    });

    const params = {
      client_id: process.env.OIDC_CLIENT_ID,
      redirect_uri: process.env.OIDC_REDIRECT_URI,
      scope: 'openid profile',
    }

    const passReqToCallback = true; // optional, defaults to false, when true req is passed as a first
                                     // argument to verify fn

    const usePKCE = 'S256'; // optional, defaults to false, when true the code_challenge_method will be
                          // resolved from the issuer configuration, instead of true you may provide
                          // any of the supported values directly, i.e. "S256" (recommended) or "plain"

    passport.use('oidc', new Strategy({ client, params, passReqToCallback, usePKCE }, (req, tokenset, userinfo, done) => {
      console.log('tokenset', tokenset);
      console.log('access_token', tokenset.access_token);
      console.log('id_token', tokenset.id_token);
      console.log('claims', tokenset.claims);
      console.log('userinfo', userinfo);

      req.session.accessToken = tokenset.access_token;

      return done(null, userinfo)
    }));
  });

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

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
app.get('/login', passport.authenticate('oidc', {
  successReturnToOrRedirect: "/"
}));

// Callback handler that OneLogin will redirect back to
// after successfully authenticating the user
app.get('/oauth/callback', passport.authenticate('oidc', {
  callback: true,
  successReturnToOrRedirect: '/users',
  failureRedirect: '/'
}))

// Destroy both the local session and
// revoke the access_token at OneLogin
app.get('/logout', function(req, res){

  console.log('Revoke Token Request: ', {
    'form':{
      'client_id': process.env.OIDC_CLIENT_ID,
      'token': req.session.accessToken,
      'token_type_hint': 'access_token'
    }
  })

  request.post(oidcIssuer + '/token/revocation',
    {
    'form':{
      'client_id': process.env.OIDC_CLIENT_ID,
      'token': req.session.accessToken,
      'token_type_hint': 'access_token'
    }
  },function(err, response, body){

    console.log('Revocation Error: ', err)
    console.log('Revocation Body: ', body)
    console.log('Session Revoked at OneLogin');
    res.redirect('/');

  });
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

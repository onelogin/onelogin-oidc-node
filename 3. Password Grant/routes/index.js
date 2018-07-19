var express = require('express');
var router = express.Router();
const request = require("request");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'OneLogin OpenId Connect Sample' });
});

//
// Login using OneLogin Password Grant
//
router.post('/login', function(req, res, next) {

  // When the Token Auth Endpoint Method is Basic
  // then OIDC_CLIENT_ID & OIDC_CLIENT_PASSWORD
  // are specified in a header
  // let options = {
  //   method: 'POST',
  //   uri: `https://openid-connect.onelogin.com/oidc/token`,
  //   auth: {
  //     user: process.env.OIDC_CLIENT_ID,
  //     pass: process.env.OIDC_CLIENT_SECRET
  //   },
  //   form: {
  //     grant_type: 'password',
  //     username: req.body.username,
  //     password: req.body.password,
  //     scope: 'openid profile email'
  //   }
  // };

  // When the Token Auth Endpoint Method is POST
  // then OIDC_CLIENT_ID & OIDC_CLIENT_PASSWORD
  // are specified in the post body
  let options = {
    method: 'POST',
    uri: `https://openid-connect.onelogin.com/oidc/token`, // For EU instances use "https://openid-connect-eu.onelogin.com/oidc/token"
    form: {
      client_id: process.env.OIDC_CLIENT_ID,
      client_secret: process.env.OIDC_CLIENT_SECRET,
      grant_type: 'password',
      username: req.body.username,
      password: req.body.password,
      scope: 'openid profile email',
      response_type: 'id_token'
    }
  };

  request(options, function(error, response, body){

    if(error){
      res.redirect('/');
    }else{

      let token = JSON.parse(body)

      req.session.accessToken = token.access_token;

      res.redirect('/profile');
    }
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
const axios = require("axios");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { });
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
  //     scope: 'openid profile'
  //   }
  // };

  // When the Token Auth Endpoint Method is POST
  // then OIDC_CLIENT_ID & OIDC_CLIENT_PASSWORD
  // are specified in the post body

  const params = new URLSearchParams();
  params.append('client_id', process.env.OIDC_CLIENT_ID);
  params.append('client_secret', process.env.OIDC_CLIENT_SECRET);
  params.append('grant_type', 'password');
  params.append('username', req.body.username);
  params.append('password', req.body.password);
  params.append('scope', 'openid profile');
  params.append('response_type', 'id_token');

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  axios.post(`${process.env.OIDC_BASE_URI}/oidc/2/token`, params, config)
  .then(function(response){

    if(response.status != 200){
      return res.render('index', {
        error_message: "Login failed"
      });
    }

    req.session.accessToken = response.data.access_token;
    
    res.redirect('/profile');    
  })
  .catch(function(error){
    console.log("ERROR")
    console.log(error)
    res.render('index', {
      error_message: error.response.data.error_description
    })
  });
});

module.exports = router;

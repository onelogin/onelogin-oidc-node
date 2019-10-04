var express = require('express');
var router = express.Router();
const request = require("request");

router.get('/', function(req, res, next) {

  let options = {
    method: 'GET',
    auth: {
      bearer: req.session.accessToken
    },
    uri: `https://openid-connect.onelogin.com/oidc/me`   // For EU instances use https://openid-connect-eu.onelogin.com/oidc/me
  };

  request(options, function(error, response, body){

    let user = JSON.parse(body);

    res.render('profile', {
      user: user
    })
  });
});

module.exports = router;

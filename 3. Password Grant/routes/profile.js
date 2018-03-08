var express = require('express');
var router = express.Router();
const request = require("request");

router.get('/', function(req, res, next) {

  let options = {
    method: 'GET',
    auth: {
      bearer: req.session.accessToken
    },
    uri: `https://${process.env.ONELOGIN_SUBDOMAIN}.onelogin.com/oidc/me`
  };

console.log(options);

  request(options, function(error, response, body){

    let user = JSON.parse(body);

    res.render('profile', {
      user: user
    })
  });
});

module.exports = router;

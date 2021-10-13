var express = require('express');
var router = express.Router();
const axios = require("axios");

router.get('/', function(req, res, next) {

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.session.accessToken}`
    }
  }

  axios.get(`${process.env.OIDC_BASE_URI}/oidc/2/me`, config)
  .then(function(response){

    if(response.status != 200){
      res.redirect("/");
    }

    res.render('profile', {
      user: response.data
    }) 
  })
  .catch(function(error){
    console.log(error);
  });
});

module.exports = router;

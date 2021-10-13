# OneLogin OpenId Connect Resource Owner Password Grant

This sample app demonstrates how to authenticate users using the Resource Owner Password Grant.

**Note: This flow has been deprecated by the OAuth Working Group. While OneLogin still supports it, we do not recommend using it for new authentication projects.**

With this example a singe OAuth2.0 style request is made to authenticate the user.

* This flow does not support MFA. If MFA is required for the user the authentication
will fail with a message indicating the MFA requirement.
* Under this flow a single sign-on session is not created for the user so they will
not be able to SSO into other apps.

## API Reference
This sample makes use of the following apis:

* [Create session via Username/Password](https://developers.onelogin.com/openid-connect/api/password-grant)
* [Get User Info](https://developers.onelogin.com/openid-connect/api/user-info)

### Create session via User/Password
This is where the user authentication takes place. On success you will get an `access_token` which can be used to fetch info about the user.

```js

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
```

### Get user info
With a valid `access_token` you can get profile information for the user. The information return is based on the `scope` that was granted in the authentication step.

```js
let options = {
  method: 'GET',
  auth: {
    bearer: req.session.accessToken
  },
  uri: `https://openid-connect.onelogin.com/oidc/me`  // EU instance: https://openid-connect-eu.onelogin.com/oidc/me
};

request(options, function(error, response, body){

  let user = JSON.parse(body);

  res.render('profile', {
    user: user
  })
});
```

## Setup
In order to run this sample you need to setup an OpenId Connect
app in your OneLogin Admin portal.

If you don't have a OneLogin developer account [you can sign up here](https://www.onelogin.com/developer-signup).

Clone this repo and then update <b>/javascripts/main.js</b> with the <b>client_id</b> you
obtained from OneLogin and the <b>subdomain</b> of your OneLogin
account.



## Run
This sample is based on a default expressjs app.

From the command line run
```
> npm install
> npm start
```

Browse to [http://localhost:3000](http://localhost:3000)

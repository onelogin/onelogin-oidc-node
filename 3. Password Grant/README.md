# OneLogin OpenId Connect Resource Owner Password Grant

This sample app demonstrates how to authenticate users using the Resource Owner Password Grant.

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
let options = {
  method: 'POST',
  uri: `https://openid-connect.onelogin.com/oidc/token`,
  form: {
    client_id: process.env.OIDC_CLIENT_ID,
    client_secret: process.env.OIDC_CLIENT_SECRET,
    grant_type: 'password',
    username: req.body.username,
    password: req.body.password,
    scope: 'openid profile',
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
```

### Get user info
With a valid `access_token` you can get profile information for the user. The information return is based on the `scope` that was granted in the authentication step.

```js
let options = {
  method: 'GET',
  auth: {
    bearer: req.session.accessToken
  },
  uri: `https://openid-connect.onelogin.com/oidc/me`
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

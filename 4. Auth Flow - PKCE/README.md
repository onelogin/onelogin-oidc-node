# OneLogin OpenId Connect Auth Code Flow + PKCE example

Best practice for Single Page Applications is to use the OpenId Connect Auth Code + PKCE (Proof Code Key Exchange) flow. 

This sample app demonstrates authenticate users in single page apps
and does not require any server side code.

The sample makes use of a pure [Javascript OpenId Connect Client](https://github.com/IdentityModel/oidc-client-js). We have included a minified
version of this client in `public/javascripts/oidc-client.min.js` or you can
fetch the [latest version here](https://github.com/IdentityModel/oidc-client-js/tree/dev/dist).

We have kept this sample to minimum functionality. However the UserManager in OIDC Client
library has many useful features for authenticating via popups, logging out, and
getting user info. Check out the [wiki](https://github.com/IdentityModel/oidc-client-js/wiki) and [samples](https://github.com/IdentityModel/oidc-client-js/tree/dev/sample/public) in the Github repo.

## How does it work?

This sample uses the same OIDC client library as the Implicit example with the main difference being that the `response_type` is set to `code`. By switching to `code` the library will take care of the `code_challenge` and `code_verifier` exchange that is necessary for the PKCE flow.

```js

var settings = {
    authority: 'https://' + ONELOGIN_SUBDOMAIN + '.onelogin.com/oidc/2',    
    client_id: ONELOGIN_CLIENT_ID,
    redirect_uri: window.location.origin,
    response_type: 'code',
    scope: 'openid profile',
    filterProtocolClaims: true,
    loadUserInfo: true
};
var mgr = new Oidc.UserManager(settings);

```

The PKCE flow contains 2 steps. The first step redirects the browser to OneLogin for user authentication. On success a `code` value will be returned to this application in the querystring. 

Your application should look out for this response and then complete the sign in. 

For example, a simple approach is to do this.
```js
if (window.location.href.indexOf("?") >= 0) {
  processLoginResponse();
}
```

You then hand back control to the OIDC client which will take care of the 2nd step in the flow where the `code` is exchanged for a set of Access, Refresh, and ID Tokens. 

```js

function processLoginResponse() {
  mgr.signinRedirectCallback().then(function(user, bb) {
      console.log("signed in", user);

      // Tokens are stored in User Manager.
      // You can access them elsewhere in code using mgr.getUser() to fetch the user object

      document.getElementById("loginResult").innerHTML = '<h3>Success</h3><pre><code>' + JSON.stringify(user, null, 2) + '</code></pre>'

  }).catch(function(err) {
      console.log('Error completing auth code + pkce flow', err);
  });
}

```

## Setup
In order to run this sample you need to setup an OpenId Connect
app in your OneLogin Admin portal.

If you don't have a OneLogin developer account [you can sign up here](https://www.onelogin.com/developer-signup).

Clone this repo and then update <b>/javascripts/main.js</b> with the <b>client_id</b> you
obtained from OneLogin and the <b>subdomain</b> of your OneLogin
account.

Note that with the Implicit flow the **client_secret** is not required.

The sample will automatically set the **redirect_uri** to the host
location that the sample is running on. You need to make sure that
this matches what you specified as the Redirect Uri when you
setup your OIDC app connector in the OneLogin portal.

## Run
This sample uses node to serve up the single home page.

From the command line run
```
> npm install
> npm start
```

### Local testing
By default these samples will run on `http://localhost:3000`.

You will need to add your callback url to the list of approved **Redirect URIs** for your OneLogin OIDC app via the Admin portal. e.g. `http://localhost:3000`